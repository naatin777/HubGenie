import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getMergedConfig } from "./config.ts";
import type { z } from "zod";
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
  const config = await getMergedConfig();

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
      {
        role: "system",
        content:
          `You must output *exclusively* in ${config.language}. No exceptions.`,
      },
      ...message,
    ],
    response_format: zodResponseFormat(
      zod,
      name,
    ),
  });
  return completion.choices[0].message.parsed;
}
