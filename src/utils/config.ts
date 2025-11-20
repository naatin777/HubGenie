import { ConfigPaths } from "./path.ts";
import { parse, stringify } from "@std/yaml";
import { Config, ScopeFlag } from "../type.ts";

export async function saveConfig(
  config: Config,
  scopeFlag: ScopeFlag,
): Promise<void> {
  const yaml = stringify(config);
  const path = await ConfigPaths.getConfigPath(scopeFlag, true);
  await Deno.writeTextFile(path, yaml);
}

export async function getConfig(key: keyof Config) {
  try {
    const path = await ConfigPaths.getConfigPath({ local: true });
    const localConfigFile = await Deno.readTextFile(path);
    const localConfig: Config = parse(localConfigFile) as Config;
    return localConfig[key];
  } catch (_) {
    const path = await ConfigPaths.getConfigPath({ global: true });
    const globalConfigFile = await Deno.readTextFile(path);
    const globalConfig: Config = parse(
      globalConfigFile,
    ) as Config;
    return globalConfig[key];
  }
}

export async function getAllConfig(scopeFlag: ScopeFlag): Promise<Config> {
  const path = await ConfigPaths.getConfigPath(scopeFlag);
  const configFile = await Deno.readTextFile(path);
  const config: Config = parse(configFile) as Config;
  return config;
}
