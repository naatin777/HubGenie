import { ConfigScope } from "../type.ts";
import inquirer from "inquirer";

export function selectScope(
  options: { global?: true | undefined },
): ConfigScope {
  if (options.global) {
    return "global";
  } else {
    return "local";
  }
}

export async function initLanguage(): Promise<string> {
  const SUPPORTED_LANGUAGES = [
    "en - English",
    "ja - 日本語 (Japanese)",
    "zh - 中文 (Chinese)",
    "ko - 한국어 (Korean)",
    "es - Español (Spanish)",
    "fr - Français (French)",
    "de - Deutsch (German)",
    "it - Italiano (Italian)",
    "pt - Português (Portuguese)",
    "ru - Русский (Russian)",
    "ar - العربية (Arabic)",
    "hi - हिन्दी (Hindi)",
    "tr - Türkçe (Turkish)",
    "vi - Tiếng Việt (Vietnamese)",
    "th - ไทย (Thai)",
  ];
  return (await inquirer.prompt<{ language: string }>({
    type: "select",
    name: "language",
    message: "Enter language",
    choices: SUPPORTED_LANGUAGES,
    default: SUPPORTED_LANGUAGES[0],
  })).language;
}

export function initEditor(): string {
  const editor = prompt("? Enter the editor › ") ?? "code --wait";
  return editor;
}
