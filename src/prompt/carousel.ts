import { bold, cyan, gray } from "@std/fmt/colors";

const encoder = new TextEncoder();
const CSI = "\x1b[";
const HIDE_CURSOR = `${CSI}?25l`;
const SHOW_CURSOR = `${CSI}?25h`;

type KeyAction = "enter" | "left" | "right" | "exit" | null;

export interface CarouselChoice<T> {
  name: string;
  value: T;
  description?: string;
}

export interface CarouselOptions<T> {
  message: string;
  choices: CarouselChoice<T>[];
  default?: T;
}

function moveUp(lines: number = 1): Uint8Array {
  return encoder.encode(`${CSI}${lines}A`);
}

function clearLines(): Uint8Array {
  return encoder.encode(`${CSI}J`);
}

async function readKey(): Promise<KeyAction> {
  const buffer = new Uint8Array(1024);
  const n = await Deno.stdin.read(buffer);
  if (n === null) return null;

  const bytes = buffer.subarray(0, n);

  if (bytes.length === 1 && bytes[0] === 3) return "exit";
  if (bytes.length === 1 && bytes[0] === 13) return "enter";
  if (bytes.length === 1 && bytes[0] === 104) return "left";
  if (bytes.length === 1 && bytes[0] === 108) return "right";

  if (bytes.length === 3 && bytes[0] === 27 && bytes[1] === 91) {
    if (bytes[2] === 68) return "left";
    if (bytes[2] === 67) return "right";
  }
  return null;
}

async function render<T>(
  message: string,
  choices: CarouselChoice<T>[],
  selectedIndex: number,
  lineCount: number,
): Promise<number> {
  if (lineCount > 0) {
    await Deno.stdout.write(moveUp(lineCount));
    await Deno.stdout.write(clearLines());
  }

  let newLines = 0;
  let output = "";

  const choice = choices[selectedIndex];
  const current = selectedIndex + 1;
  const total = choices.length;

  const title = `${bold(`? ${message}`)}\n`;
  output += title;
  newLines += title.split("\n").length - 1;

  const nav = `← ${current}/${total} →`;
  const help = gray(" (Enter to Select)");
  output += `${nav}${help}\n`;
  newLines += 1;

  const name = `\n${bold(cyan(choice.name))}\n`;
  output += name;
  newLines += name.split("\n").length - 1;

  if (choice.description) {
    const descLines = choice.description.split("\n");
    for (const line of descLines) {
      output += `${line}\n`;
      newLines += 1;
    }
  }

  await Deno.stdout.write(encoder.encode(output));
  return newLines;
}

export async function carouselPrompt<T>(
  options: CarouselOptions<T>,
): Promise<T> {
  const { message, choices, default: defaultValue } = options;

  let selectedIndex = 0;
  if (defaultValue) {
    const idx = choices.findIndex((c) => c.value === defaultValue);
    if (idx > -1) selectedIndex = idx;
  }

  try {
    Deno.stdin.setRaw(true);
  } catch (e) {
    console.warn("Failed to set TTY raw mode:", e);
  }
  await Deno.stdout.write(encoder.encode(HIDE_CURSOR));

  let lineCount = 0;
  let running = true;
  let finalValue: T | null = null;

  while (running) {
    lineCount = await render(
      message,
      choices,
      selectedIndex,
      lineCount,
    );

    const action = await readKey();

    switch (action) {
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
        break;
    }
  }

  await Deno.stdout.write(moveUp(lineCount));
  await Deno.stdout.write(clearLines());

  const resultText = finalValue ? choices[selectedIndex].name : "(Aborted)";
  await Deno.stdout.write(
    encoder.encode(`${bold(`? ${message}`)} ${cyan(resultText)}\n`),
  );

  await Deno.stdout.write(encoder.encode(SHOW_CURSOR));
  try {
    Deno.stdin.setRaw(false);
  } catch (_) { /* */ }

  if (finalValue === null) {
    Deno.exit(1);
  }

  return finalValue;
}
