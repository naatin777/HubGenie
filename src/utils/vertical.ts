import { bold, cyan } from "@std/fmt/colors";

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
    if (bytes[0] === 106) return "down"; // j
    if (bytes[0] === 107) return "up"; // k
    if (bytes[0] === 3) return "exit";
  }
  if (bytes.length === 3 && bytes[0] === 27 && bytes[1] === 91) {
    if (bytes[2] === 65) return "up"; // Arrow Up
    if (bytes[2] === 66) return "down"; // Arrow Down
  }
  return null;
}

async function renderPrompt<T>(
  question: string,
  choices: Choice<T>[],
  selectedIndex: number,
  lineCount: number,
): Promise<number> {
  if (lineCount > 0) {
    await Deno.stdout.write(moveUp(lineCount));
    await Deno.stdout.write(clearLines());
  }

  let newLines = 0;
  let output = "";

  const q: string = `${bold(`? ${question}`)}\n`;
  output += q;
  newLines += q.split("\n").length - 1;

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (i === selectedIndex) {
      output += `${cyan("❯")} ${cyan(choice.name)}\n`;
    } else {
      output += `  ${choice.name}\n`;
    }
    newLines += 1;
  }

  await Deno.stdout.write(encoder.encode(output));
  return newLines;
}

export async function selectPrompt<T>(
  options: SelectPromptOptions<T>,
): Promise<T> {
  const { message, choices, default: defaultValue } = options;

  let selectedIndex: number = 0;
  if (defaultValue) {
    const defaultIndex: number = choices.findIndex(
      (c) => c.value === defaultValue,
    );
    if (defaultIndex > -1) {
      selectedIndex = defaultIndex;
    }
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
    );

    const key: KeyType = await readKey();

    switch (key) {
      case "down":
        selectedIndex = (selectedIndex + 1) % choices.length;
        break;
      case "up":
        selectedIndex = (selectedIndex - 1 + choices.length) % choices.length;
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
