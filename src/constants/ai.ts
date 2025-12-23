export const AI_PROVIDER = [
  "OpenRouter",
  "ChatGPT",
  "Claude",
  "Google Gemini",
] as const;

export type AI_PROVIDER_KEY = typeof AI_PROVIDER[number];
