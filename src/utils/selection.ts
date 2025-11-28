import { LANGUAGES } from "../constants/language.ts";
import { selectPrompt } from "../prompt/select.ts";

export async function selectLanguage(): Promise<string> {
  return await selectPrompt({
    message: "Enter language",
    choices: LANGUAGES.map((language) => ({
      name: `${language.code} - ${language.label}`,
      value: `${language.code} - ${language.label}`,
    })),
  });
}

export function selectEditor(): string {
  const editor = prompt("? Enter the editor › ") ?? "code --wait";
  return editor;
}

export function inputOverview(): string {
  const overview = prompt("? Enter the overview › ") ?? "";
  return overview;
}
