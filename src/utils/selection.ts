import { LANGUAGE } from "../constants/language.ts";
import { selectPrompt } from "../prompt/select.ts";

export async function initLanguage(): Promise<string> {
  return await selectPrompt({
    message: "Enter language",
    choices: LANGUAGE.map((language) => ({
      name: language,
      value: language,
    })),
    default: LANGUAGE[0],
  });
}

export function initEditor(): string {
  const editor = prompt("? Enter the editor › ") ?? "code --wait";
  return editor;
}
