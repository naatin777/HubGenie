import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { getMergedConfig } from "./config.ts";
import type z from "zod";
import { getApiKey, getBaseURL, getModel } from "./env.ts";

export async function createParsedCompletions<T extends z.ZodType>(
  message: {
    role: "user" | "system" | "assistant";
    content: string;
  }[],
  zod: T,
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
      { role: "system", content: `Please output in ${config.language}.` },
      ...message,
    ],
    response_format: zodResponseFormat(
      zod,
      name,
    ),
  });
  return completion.choices[0].message.parsed;
}

interface AgentLoopProtocol<TResult> {
  status: "question" | "final_answer";
  question: {
    content: string;
    reason: string;
  } | null;
  final_answer: TResult | null;
}

export async function runAgentLoop<
  TResult,
  TSchema extends z.ZodType<AgentLoopProtocol<TResult>>,
>(
  messages: {
    role: "user" | "system" | "assistant";
    content: string;
  }[],
  schema: TSchema,
  name: string,
  askUser: (question: string) => Promise<string>,
): Promise<TResult> {
  const history = [...messages];

  while (true) {
    const completion = await createParsedCompletions(
      history,
      schema,
      name,
    );

    if (!completion) {
      throw new Error("Failed to parse completion");
    }

    if (completion.status === "question") {
      const qData = completion.question;
      if (!qData) throw new Error("Status is question but data is null");

      console.log(`[Thinking] ${qData.reason}`);

      history.push({
        role: "assistant",
        content: qData.content,
      });

      const userAnswer = await askUser(qData.content);

      history.push({
        role: "user",
        content: userAnswer,
      });
    } else if (completion.status === "final_answer") {
      const result = completion.final_answer;
      if (!result) throw new Error("Status is final_answer but data is null");

      return result;
    } else {
      throw new Error(`Unexpected status received`);
    }
  }
}
