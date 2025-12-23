import { load } from "@std/dotenv";
import { EnvError } from "../lib/errors.ts";

type EnvKey =
  | "DEMMITHUB_AI_API_KEY"
  | "DEMMITHUB_GITHUB_TOKEN";

let envLoadingPromise: Promise<void> | undefined = undefined;

async function getEnv(key: EnvKey): Promise<string> {
  if (!envLoadingPromise) {
    envLoadingPromise = (async () => {
      await load({ export: true });
    })();
  }
  await envLoadingPromise;
  const value = Deno.env.get(key);
  if (!value) throw new EnvError(key);
  return value;
}

export interface EnvService {
  getAiApiKey(): Promise<string>;
  getGitHubToken(): Promise<string>;
}

export const envService: EnvService = {
  getAiApiKey: async () => await getEnv("DEMMITHUB_AI_API_KEY"),
  getGitHubToken: async () => await getEnv("DEMMITHUB_GITHUB_TOKEN"),
};
