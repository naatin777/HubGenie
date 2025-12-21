import { ConfigPaths } from "../utils/path.ts";
import { parse, stringify } from "@std/yaml";
import type { Config, ScopeFlag } from "../type.ts";
import { defaultConfig } from "../constants/config.ts";

export async function saveConfig(
  config: Config,
  scopeFlag: ScopeFlag,
): Promise<void> {
  const yaml = stringify(config);
  const path = await ConfigPaths.getConfigPath(scopeFlag, true);
  await Deno.writeTextFile(path, yaml);
}

export async function getConfig(
  scopeFlag: ScopeFlag,
): Promise<Config | undefined> {
  try {
    const path = await ConfigPaths.getConfigPath(scopeFlag);
    const configFile = await Deno.readTextFile(path);
    const config: Config = parse(configFile) as Config;
    return config;
  } catch (_) {
    return undefined;
  }
}

export async function getMergedConfig(): Promise<Config> {
  const globalConfig = await getConfig({ local: undefined, global: true }) ||
    {};
  const projectConfig =
    await getConfig({ local: undefined, global: undefined }) || {};
  const localConfig = await getConfig({ local: true, global: undefined }) || {};

  const mergedConfig = {
    ...defaultConfig,
    ...globalConfig,
    ...projectConfig,
    ...localConfig,
  };

  return mergedConfig;
}
