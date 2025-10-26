import OpenAI from "@openai/openai";

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
