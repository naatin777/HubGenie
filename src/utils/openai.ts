import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getMergedConfig } from "./config.ts";
import type z from "zod";
import { getApiKey, getBaseURL, getModel } from "./env.ts";
import { IssueAgentSchema } from "../schema.ts";

export async function generateStructuredOutput<T extends z.ZodType>(
  message: {
    role: "user" | "system" | "assistant";
    content: string;
  }[],
  schema: T,
  name: string,
): Promise<z.Infer<T> | null> {
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
      schema,
      name,
    ),
  });
  return completion.choices[0].message.parsed;
}

export async function issueAgent(
  messages: {
    role: "user" | "system" | "assistant";
    content: string;
  }[],
) {
  const history = [...messages];

  while (true) {
    const completion = await generateStructuredOutput(
      history,
      IssueAgentSchema,
      "issueAgent",
    );

    if (!completion) {
      throw new Error("Failed to parse completion");
    }

    if (completion.agent.status === "question") {
      for (const question of completion.agent.questions) {
        const userAnswer = prompt(question) ||
          "leave it to you";

        history.push({
          role: "user",
          content: `question: ${question} answer: ${userAnswer}`,
        });
      }
    } else if (completion.agent.status === "final_answer") {
      return completion.agent.item;
    } else {
      throw new Error(`Unexpected status received`);
    }
  }
}
