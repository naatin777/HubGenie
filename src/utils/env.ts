import { load } from "@std/dotenv";
import { EnvKey } from "../type.ts";

async function getEnv(key: EnvKey): Promise<string> {
  await load({ export: true });

  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not set`);
  return value;
}

export async function getApiKey(): Promise<string> {
  return await getEnv("HUBGENIE_API_KEY");
}

export async function getBaseURL(): Promise<string> {
  return await getEnv("HUBGENIE_BASE_URL");
}

export async function getModel(): Promise<string> {
  return await getEnv("HUBGENIE_MODEL");
}
