import { ConfigPaths } from "./path.ts";
import { getEnv } from "./env.ts";
import { parse, stringify } from "@std/yaml";
import { Config } from "../type.ts";

export async function saveConfig(
  config: Config,
  global?: true | undefined,
): Promise<void> {
  await ConfigPaths.ensureConfigDir(global);
  const json = stringify(config);
  const path = await ConfigPaths.getConfigPath(global, true);
  await Deno.writeTextFile(path, json);
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

export async function getConfig(key: keyof Config) {
  try {
    const path = await ConfigPaths.getConfigPath(undefined);
    const localConfigFile = await Deno.readTextFile(path);
    const localConfig: Config = parse(localConfigFile) as Config;
    return localConfig[key];
  } catch (_) {
    const path = await ConfigPaths.getConfigPath(true);
    const globalConfigFile = await Deno.readTextFile(path);
    const globalConfig: Config = parse(
      globalConfigFile,
    ) as Config;
    return globalConfig[key];
  }
}

export async function getAllConfig(global?: true | undefined): Promise<Config> {
  const path = await ConfigPaths.getConfigPath(global);
  const configFile = await Deno.readTextFile(path);
  const config: Config = parse(configFile) as Config;
  return config;
}
