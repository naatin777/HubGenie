import { bold, cyan, gray } from "@std/fmt/colors";

const encoder = new TextEncoder();

const CSI = "\x1b[";
const HIDE_CURSOR = `${CSI}?25l`;
const SHOW_CURSOR = `${CSI}?25h`;

type KeyType = "enter" | "up" | "down" | "exit" | null;

export interface Choice<T> {
  name: string;
  value: T;
  description?: string;
}

export interface SelectPromptOptions<T> {
  message: string;
  choices: Choice<T>[];
  default?: T;
  pageSize?: number;
}

function moveUp(lines: number = 1): Uint8Array {
  return encoder.encode(`${CSI}${lines}A`);
}

function clearLines(): Uint8Array {
  return encoder.encode(`${CSI}J`);
}

async function readKey(): Promise<KeyType> {
  const buffer = new Uint8Array(1024);
  const n: number | null = await Deno.stdin.read(buffer);
  if (n === null) return null;

  const bytes: Uint8Array = buffer.subarray(0, n);

  if (bytes.length === 1) {
    if (bytes[0] === 13) return "enter";
    if (bytes[0] === 106) return "down";
    if (bytes[0] === 107) return "up";
    if (bytes[0] === 3) return "exit";
  }
  if (bytes.length === 3 && bytes[0] === 27 && bytes[1] === 91) {
    if (bytes[2] === 65) return "up";
    if (bytes[2] === 66) return "down";
  }
  return null;
}

async function renderPrompt<T>(
  question: string,
  choices: Choice<T>[],
  selectedIndex: number,
  lineCount: number,
  scrollTop: number,
  pageSize: number,
): Promise<number> {
  if (lineCount > 0) {
    await Deno.stdout.write(moveUp(lineCount));
    await Deno.stdout.write(clearLines());
  }

  let newLines = 0;
  let output = "";

  const counter = gray(`(${selectedIndex + 1}/${choices.length})`);
  const q: string = `${bold(`? ${question}`)} ${counter}\n`;
  output += q;
  newLines += q.split("\n").length - 1;

  const visibleChoices = choices.slice(scrollTop, scrollTop + pageSize);

  for (let i = 0; i < visibleChoices.length; i++) {
    const choiceIndex = scrollTop + i;
    const choice = visibleChoices[i];

    if (choiceIndex === selectedIndex) {
      output += `${cyan("❯")} ${cyan(choice.name)}\n`;
      newLines += 1;

      if (choice.description) {
        const descLines = choice.description.split("\n");
        for (const line of descLines) {
          output += `  ${gray(line)}\n`;
          newLines += 1;
        }
      }
    } else {
      output += `  ${choice.name}\n`;
      newLines += 1;
    }
  }

  await Deno.stdout.write(encoder.encode(output));
  return newLines;
}

export async function selectPrompt<T>(
  options: SelectPromptOptions<T>,
): Promise<T> {
  const { message, choices, default: defaultValue, pageSize = 10 } = options;

  let selectedIndex: number = 0;
  if (defaultValue) {
    const defaultIndex: number = choices.findIndex(
      (c) => c.value === defaultValue,
    );
    if (defaultIndex > -1) {
      selectedIndex = defaultIndex;
    }
  }

  let scrollTop = 0;
  if (selectedIndex >= pageSize) {
    scrollTop = selectedIndex - pageSize + 1;
  }

  try {
    Deno.stdin.setRaw(true);
  } catch (_) {
    console.warn(`Failed to set TTY raw mode`);
  }
  await Deno.stdout.write(encoder.encode(HIDE_CURSOR));

  let lineCount: number = 0;
  let running: boolean = true;
  let finalValue: T | null = null;

  while (running) {
    lineCount = await renderPrompt<T>(
      message,
      choices,
      selectedIndex,
      lineCount,
      scrollTop,
      pageSize,
    );

    const key: KeyType = await readKey();

    switch (key) {
      case "down":
        selectedIndex = (selectedIndex + 1) % choices.length;
        if (selectedIndex === 0) {
          scrollTop = 0;
        } else if (selectedIndex >= scrollTop + pageSize) {
          scrollTop = selectedIndex - pageSize + 1;
        }
        break;
      case "up":
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
        if (selectedIndex === choices.length - 1) {
          scrollTop = Math.max(0, choices.length - pageSize);
        } else if (selectedIndex < scrollTop) {
          scrollTop = selectedIndex;
        }
        break;
      case "enter":
        running = false;
        finalValue = choices[selectedIndex].value;
        break;
      case "exit":
        running = false;
        finalValue = null;
        break;
    }
  }

  await Deno.stdout.write(moveUp(lineCount));
  await Deno.stdout.write(clearLines());
  await Deno.stdout.write(
    encoder.encode(
      `${bold(`? ${message}`)} ${
        cyan(
          finalValue ? choices[selectedIndex].name : "(Aborted)",
        )
      }\n`,
    ),
  );

  await Deno.stdout.write(encoder.encode(SHOW_CURSOR));
  try {
    Deno.stdin.setRaw(false);
  } catch (_) {
    //
  }

  if (finalValue === null) {
    Deno.exit(1);
  }

  return finalValue;
}
