import { load } from "@std/dotenv";
import type { EnvKey } from "../type.ts";

await load({ export: true });

function getEnv(key: EnvKey): string {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not set`);
  return value;
}

export interface EnvService {
  getApiKey(): string;
  getBaseURL(): string;
  getModel(): string;
  getGitHubToken(): string;
}

export const envService: EnvService = {
  getApiKey: () => getEnv("DEMMITHUB_API_KEY"),
  getBaseURL: () => getEnv("DEMMITHUB_BASE_URL"),
  getModel: () => getEnv("DEMMITHUB_MODEL"),
  getGitHubToken: () => getEnv("DEMMITHUB_GITHUB_TOKEN"),
};
