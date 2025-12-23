import { parse, stringify } from "@std/yaml";
import { defaultConfig } from "../constants/config.ts";
import type { AI_PROVIDER_KEY } from "../constants/ai.ts";
import type { EnvService } from "./env.ts";
import { join } from "@std/path";
import DenoJson from "../../deno.json" with { type: "json" };

export type Config = {
  language: string;
  editor: string;
  overview: string;
  provider: AI_PROVIDER_KEY;
  model: string;
};

export type ConfigScope = "local" | "global" | "project";

export class ConfigService {
  private scope: ConfigScope;
  private envService: EnvService;

  constructor(scope: ConfigScope, envService: EnvService) {
    this.scope = scope;
    this.envService = envService;
  }

  static createFromFlags(
    flags: { local: boolean; global: boolean },
    envService: EnvService,
  ) {
    if (flags.local && !flags.global) {
      return new ConfigService("local", envService);
    } else if (!flags.local && flags.global) {
      return new ConfigService("global", envService);
    } else {
      return new ConfigService("project", envService);
    }
  }

  async getPath(scope: ConfigScope = this.scope) {
    const home = await this.envService.getHome();
    switch (scope) {
      case "local":
        return join(Deno.cwd(), `.${DenoJson.name}.local.yml`);
      case "global":
        return join(home, ".config", DenoJson.name, ".config.yml");
      case "project":
        return join(Deno.cwd(), `.${DenoJson.name}.yml`);
    }
  }

  async save(config: Config, scope: ConfigScope = this.scope) {
    const yaml = stringify(config);
    const path = await this.getPath(scope);
    await Deno.writeTextFile(path, yaml);
  }

  async load(scope: ConfigScope = this.scope) {
    try {
      const path = await this.getPath(scope);
      const configFile = await Deno.readTextFile(path);
      const config: Config = parse(configFile) as Config;
      return config;
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return {};
      }
      throw e;
    }
  }

  async saveFromKey<K extends keyof Config>(
    key: K,
    value: Config[K],
    scope: ConfigScope = this.scope,
  ) {
    const config = await this.load(scope);
    await this.save({ ...config, [key]: value } as Config, scope);
  }

  async getMerged() {
    const globalConfig = await this.load("global") || {};
    const projectConfig = await this.load("project") || {};
    const localConfig = await this.load("local") || {};

    const mergedConfig = {
      ...defaultConfig,
      ...globalConfig,
      ...projectConfig,
      ...localConfig,
    };

    return mergedConfig;
  }
}
