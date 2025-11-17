import { bold, cyan, dim } from "@std/fmt/colors";

const encoder = new TextEncoder();

const CSI = "\x1b[";
const HIDE_CURSOR = `${CSI}?25l`;
const SHOW_CURSOR = `${CSI}?25h`;

type KeyType = "enter" | "right" | "left" | "exit" | null;

export interface Choice<T> {
  name: string;
  value: T;
  description?: string;
}

export interface VerticalCyclePromptOptions<T> {
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
    if (bytes[0] === 108) return "right";
    if (bytes[0] === 104) return "left";
    if (bytes[0] === 3) return "exit";
  }
  if (bytes.length === 3 && bytes[0] === 27 && bytes[1] === 91) {
    if (bytes[2] === 67) return "right";
    if (bytes[2] === 68) return "left";
  }
  return null;
}

async function renderPrompt<T>(
  question: string,
  choices: Choice<T>[],
  selectedIndex: number,
  lineCount: number,
): Promise<number> {
  const choice: Choice<T> = choices[selectedIndex];
  const total: number = choices.length;
  const current: number = selectedIndex + 1;

  if (lineCount > 0) {
    await Deno.stdout.write(moveUp(lineCount));
    await Deno.stdout.write(clearLines());
  }

  let newLines = 0;
  let output = "";

  const q: string = `${bold(`? ${question}`)}\n`;
  output += q;
  newLines += q.split("\n").length - 1;

  const nav: string = `← ${current}/${total} →`;
  const sel: string = `${dim(` (↩ Select)`)}\n`;
  output += nav + sel;
  newLines += (nav + sel).split("\n").length - 1;

  const name: string = `\n${bold(choice.name)}\n`;
  output += name;
  newLines += name.split("\n").length - 1;

  if (choice.description) {
    output += choice.description + "\n";
    newLines += choice.description.split("\n").length;
  }

  await Deno.stdout.write(encoder.encode(output));
  return newLines;
}

export async function verticalCyclePrompt<T>(
  options: VerticalCyclePromptOptions<T>,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.warn(`Failed to set TTY raw mode: ${message}.`);
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
      case "right":
        selectedIndex = (selectedIndex + 1) % choices.length;
        break;
      case "left":
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
