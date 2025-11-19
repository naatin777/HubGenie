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
  await Deno.writeTextFile(ConfigPaths.getConfigPath(global), json);
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
    const localConfigFile = await Deno.readTextFile(
      ConfigPaths.getConfigPath(undefined),
    );
    const localConfig: Config = parse(localConfigFile) as Config;
    return localConfig[key];
  } catch (_) {
    const globalConfigFile = await Deno.readTextFile(
      ConfigPaths.getConfigPath(true),
    );
    const globalConfig: Config = parse(
      globalConfigFile,
    ) as Config;
    return globalConfig[key];
  }
}

export async function getAllConfig(global?: true | undefined): Promise<Config> {
  const configFile = await Deno.readTextFile(
    ConfigPaths.getConfigPath(global),
  );
  const config: Config = parse(configFile) as Config;
  return config;
}
