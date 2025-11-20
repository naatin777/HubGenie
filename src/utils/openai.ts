import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getConfig } from "./config.ts";
import { z } from "zod";
import { getApiKey, getBaseURL, getModel } from "./env.ts";

export async function createParsedCompletions<T extends z.ZodType>(
  message: {
    role: "user" | "system";
    content: string;
  }[],
  zod: T,
  name: string,
) {
  const apiKey = await getApiKey();
  const baseURL = await getBaseURL();
  const model = await getModel();
  const language = await getConfig("language") as string;

  const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
    organization: null,
    project: null,
    webhookSecret: null,
    logLevel: "off",
  });

  const completion = await openai.chat.completions.parse({
    model: model,
    messages: [
      { role: "system", content: `Please output in ${language}.` },
      ...message,
    ],
    response_format: zodResponseFormat(
      zod,
      name,
    ),
  });
  return completion.choices[0].message.parsed;
}
