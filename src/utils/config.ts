import { load } from "@std/dotenv";
import { ConfigPaths } from "./path.ts";
import { ConfigScope } from "../type.ts";

export async function getApiKeyFromEnv(): Promise<string> {
  await load({ export: true });

  const apiKey = Deno.env.get("HUBGENIE_API_KEY");
  if (!apiKey) throw new Error("HUBGENIE_API_KEY is not set");
  return apiKey;
}

export interface LocalConfig {
  baseURL: string;
  model: string;
  temperature: number[];
  language: string;
}
export interface GlobalConfig extends LocalConfig {
  apiKey: string;
}

export async function saveConfig(
  config: GlobalConfig,
  scope: ConfigScope,
): Promise<void>;
export async function saveConfig(
  config: LocalConfig,
  scope: ConfigScope,
): Promise<void>;
export async function saveConfig(
  config: LocalConfig | GlobalConfig,
  scope: ConfigScope,
): Promise<void> {
  await ConfigPaths.ensureConfigDir(scope);
  const json = JSON.stringify(config, null, 2);
  await Deno.writeTextFile(ConfigPaths.getConfigPath(scope), json);
}
