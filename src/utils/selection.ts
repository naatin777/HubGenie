import { LANGUAGES } from "../constants/language.ts";
import { EDITORS } from "../constants/editor.ts";
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

export async function selectEditor(): Promise<string> {
  const choices = [
    ...EDITORS.map((e) => ({
      name: e.label,
      value: e.value,
      description: `Launch with: ${e.value}`,
    })),
    {
      name: "Other...",
      value: "CUSTOM",
      description: "Enter a custom command",
    },
  ];

  const selected = await selectPrompt({
    message: "Select editor",
    choices: choices,
  });

  if (selected === "CUSTOM") {
    const custom = prompt("? Enter custom editor command › ");
    return custom || EDITORS[0].value;
  }

  return selected;
}

export function inputOverview(): string {
  const overview = prompt("? Enter the overview › ") ?? "";
  return overview;
}
