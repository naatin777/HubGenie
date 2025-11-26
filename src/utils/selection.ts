import { selectPrompt } from "../prompt/select.ts";

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
  return await selectPrompt({
    message: "Enter language",
    choices: SUPPORTED_LANGUAGES.map((language) => ({
      name: language,
      value: language,
    })),
    default: SUPPORTED_LANGUAGES[0],
  });
}

export function initEditor(): string {
  const editor = prompt("? Enter the editor › ") ?? "code --wait";
  return editor;
}
