import { Input, List, Secret, Select } from "@cliffy/prompt";
import { ConfigScope } from "../type.ts";
import { getModelList } from "./openai.ts";

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

export async function initBaseURL(): Promise<string> {
  const baseUrl = await Select.prompt({
    message: "Select AI service",
    options: [
      { name: "ChatGPT", value: "https://api.openai.com/v1/" },
      {
        name: "Gemini",
        value: "https://generativelanguage.googleapis.com/v1beta/openai/",
      },
      { name: "Claude", value: "https://api.anthropic.com/v1/" },
      { name: "Other", value: "" },
    ],
  });
  if (!baseUrl) {
    return await Input.prompt("Enter custom API URL");
  } else {
    return baseUrl;
  }
}

export async function initApiKey(): Promise<string> {
  return await Secret.prompt("Enter your API key");
}

export async function initModel(
  baseURL: string,
  apiKey: string,
): Promise<string> {
  const models = await getModelList(baseURL, apiKey);
  const model = await Select.prompt({
    message: "Select AI model",
    options: models.map((value) => ({ name: value.id, value: value.id })),
  });
  return model;
}

export async function initTemperature(): Promise<number[]> {
  const temperature = await List.prompt({
    message: "Select temperature value (0.0 - 2.0)",
    suggestions: [...Array(21).keys()].map((i) => (i * 0.1).toFixed(1)),
    default: ["0.2", "0.7", "1.0"],
    list: true,
    info: true,
  });

  return temperature.map((value) => Number(value));
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
