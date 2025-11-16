import { Input, Select } from "@cliffy/prompt";
import { ConfigScope } from "../type.ts";

export async function selectScope(
  options: { local?: true | undefined; global?: true | undefined },
): Promise<ConfigScope> {
  const localFlag = options.local;
  const globalFlag = options.global;

  if (localFlag && !globalFlag) {
    return "local";
  } else if (!localFlag && globalFlag) {
    return "global";
  } else {
    const scope = await Select.prompt({
      message: "Select configuration scope",
      options: [
        { name: "Local (project)", value: "local" },
        { name: "Global (user-wide)", value: "global" },
      ],
      default: "local",
    });
    return scope as ConfigScope;
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
  return await Input.prompt({
    message: "Enter language",
    suggestions: SUPPORTED_LANGUAGES,
    default: SUPPORTED_LANGUAGES[0],
    list: true,
    info: true,
  });
}

export function initEditor(): string {
  const editor = prompt("? Enter the editor › ") ?? "code --wait";
  return editor;
}
