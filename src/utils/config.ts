import { ConfigPaths } from "./path.ts";
import { ConfigScope } from "../type.ts";
import { getEnv } from "./env.ts";

export interface Config {
  baseURL: string;
  model: string;
  language: string;
  editor: string;
}

export async function saveConfig(
  config: Config,
  scope: ConfigScope,
): Promise<void> {
  await ConfigPaths.ensureConfigDir(scope);
  const json = JSON.stringify(config, null, 2);
  await Deno.writeTextFile(ConfigPaths.getConfigPath(scope), json);
}

export async function getApiKey(): Promise<string> {
  return await getEnv("HUBGENIE_API_KEY");
}

export async function getConfig(key: keyof Config) {
  try {
    const localConfigFile = await Deno.readTextFile(
      ConfigPaths.getConfigPath("local"),
    );
    const localConfig: Config = JSON.parse(localConfigFile);
    return localConfig[key];
  } catch (_) {
    const globalConfigFile = await Deno.readTextFile(
      ConfigPaths.getConfigPath("global"),
    );
    const globalConfig: Config = JSON.parse(
      globalConfigFile,
    );
    return globalConfig[key];
  }
}

export async function getAllConfig(scope: ConfigScope): Promise<Config> {
  const configFile = await Deno.readTextFile(
    ConfigPaths.getConfigPath(scope),
  );
  const config: Config = JSON.parse(configFile);
  return config;
}
