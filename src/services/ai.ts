import { z } from "zod";
import { generateObject, type LanguageModel, type ModelMessage } from "ai";
import type { AI_PROVIDER_KEY } from "../constants/ai.ts";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { envService } from "./env.ts";
import { getMergedConfig } from "./config.ts";

export class AIService {
  protected modelCache: LanguageModel | null = null;
  protected provider: AI_PROVIDER_KEY;
  protected model: string;
  protected aiApiKey: string;

  constructor(
    provider: AI_PROVIDER_KEY,
    model: string,
    aiApiKey: string,
  ) {
    this.provider = provider;
    this.model = model;
    this.aiApiKey = aiApiKey;
  }

  static async create() {
    const config = await getMergedConfig();
    const provider = config.provider;
    const model = config.model;
    const aiApiKey = await envService.getAiApiKey();
    return new AIService(provider, model, aiApiKey);
  }

  protected getModel(): LanguageModel {
    if (this.modelCache) {
      return this.modelCache;
    }

    switch (this.provider) {
      case "OpenRouter": {
        const openrouter = createOpenRouter({
          apiKey: this.aiApiKey,
        });
        this.modelCache = openrouter(this.model);
        break;
      }
      case "ChatGPT":
      case "Claude":
      case "Google Gemini":
        throw new Error(`Unknown provider: ${this.provider}`);
    }

    return this.modelCache!;
  }

  async generateStructuredOutput<T extends z.ZodType>(
    messages: ModelMessage[],
    system: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const { object } = await generateObject({
      model: await this.getModel(),
      system: system,
      messages: messages,
      schema: schema,
    });
    return object as z.infer<T>;
  }
}

if (import.meta.main) {
  const aiService = await AIService.create();
  const result = await aiService.generateStructuredOutput(
    [
      {
        role: "user",
        content: "Hello, how are you?",
      },
    ],
    "please output success or error",
    z.object({
      type: z.discriminatedUnion("type", [
        z.object({ type: z.literal("success"), message: z.string() }),
        z.object({ type: z.literal("error"), code: z.number() }),
      ]),
    }),
  );
  console.log(result);
}
