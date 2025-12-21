import { load } from "@std/dotenv";

type EnvKey =
  | "DEMMITHUB_API_KEY"
  | "DEMMITHUB_BASE_URL"
  | "DEMMITHUB_MODEL"
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
  if (!value) throw new Error(`${key} is not set`);
  return value;
}

export interface EnvService {
  getApiKey(): Promise<string>;
  getBaseURL(): Promise<string>;
  getModel(): Promise<string>;
  getGitHubToken(): Promise<string>;
}

export const envService: EnvService = {
  getApiKey: async () => await getEnv("DEMMITHUB_API_KEY"),
  getBaseURL: async () => await getEnv("DEMMITHUB_BASE_URL"),
  getModel: async () => await getEnv("DEMMITHUB_MODEL"),
  getGitHubToken: async () => await getEnv("DEMMITHUB_GITHUB_TOKEN"),
};
