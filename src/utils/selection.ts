import { ConfigScope } from "../type.ts";
import inquirer from "inquirer";

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
    const scope = await inquirer.prompt<{ scope: ConfigScope }>({
      type: "select",
      name: "scope",
      message: "Select configuration scope",
      choices: [
        { name: "Local (project)", value: "local" },
        { name: "Global (user-wide)", value: "global" },
      ],
      default: "local",
    });
    return scope.scope;
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
