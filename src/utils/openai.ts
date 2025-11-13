import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getApiKey, getConfig } from "./config.ts";
import { z } from "zod";

export async function getModelList(baseURL: string, apiKey: string) {
  const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
    organization: null,
    project: null,
    webhookSecret: null,
    logLevel: "off",
  });
  const list = openai.models.list();
  return await Array.fromAsync(list);
}

export async function createParsedCompletions<T extends z.ZodType>(
  message: {
    role: "user" | "system";
    content: string;
  }[],
  zod: T,
  name: string,
) {
  const apiKey = await getApiKey();
  const baseURL = await getConfig("baseURL") as string;
  const temperatures = await getConfig("temperature") as number[];
  const model = await getConfig("model") as string;

  const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey,
    organization: null,
    project: null,
    webhookSecret: null,
    logLevel: "off",
  });
  return await Promise.all(
    temperatures.map(async (temperature: number) => {
      const completion = await openai.chat.completions.parse({
        model: model,
        temperature: temperature,
        messages: message,
        response_format: zodResponseFormat(
          zod,
          name,
        ),
      });
      return completion.choices[0].message.parsed;
    }),
  );
}

export async function getCommitMessage(
  diff: string,
): Promise<string[]> {
  const openai = new OpenAI({
    baseURL: (await getConfig("baseURL")) as string,
    apiKey: await getApiKey(),
    organization: null,
    project: null,
    webhookSecret: null,
    logLevel: "off",
  });

  const temperatures = await getConfig("temperature") as number[];
  const commitMessages = await Promise.all(
    temperatures.map(async (temperature) => {
      const completion = await openai.chat.completions.parse({
        model: await getConfig("model") as string,
        temperature: temperature,
        messages: [
          {
            role: "system",
            content:
              "You are a commit message assistant. Read the following diff and come up with 10 appropriate commit messages.",
          },
          {
            role: "system",
            content: `Please output in ${await getConfig(
              "language",
            ) as string}.`,
          },
          {
            role: "user",
            content: diff,
          },
        ],
        response_format: zodResponseFormat(
          z.object({
            commit_messages: z.array(z.string()),
          }),
          "commit messages",
        ),
      });
      return completion.choices[0].message.parsed?.commit_messages ?? [];
    }),
  );
  return commitMessages.flat();
}
