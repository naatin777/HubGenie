import { dirname, join } from "@std/path";
import { ensureDir, existsSync } from "@std/fs";
import { META } from "../meta.ts";
import { ScopeFlag } from "../type.ts";

export class ConfigPaths {
  private static findProjectConfig(filename: string): string {
    let currentDir = Deno.cwd();

    while (true) {
      const filePath = join(currentDir, filename);
      if (existsSync(filePath)) {
        return filePath;
      }

      const parentDir = dirname(currentDir);
      if (parentDir === currentDir) {
        throw new Error(`${filename} not found`);
      }
      currentDir = parentDir;
    }
  }

  private static async getOrCreateProjectConfig(
    filename: string,
    create?: boolean,
  ): Promise<string> {
    if (create) {
      const currentDir = Deno.cwd();
      const createPath = join(currentDir, filename);
      await ensureDir(dirname(createPath));
      await Deno.writeTextFile(createPath, "");
      return createPath;
    } else {
      return this.findProjectConfig(filename);
    }
  }

  private static getGlobalConfigDir(): string {
    const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
    if (!home) {
      throw new Error("Home directory not found");
    }
    return join(home, ".config", META.name);
  }

  private static async getOrCreateGlobalConfigPath(): Promise<string> {
    const createPath = join(this.getGlobalConfigDir(), "config.yml");
    if (!existsSync(createPath)) {
      await ensureDir(dirname(createPath));
      await Deno.writeTextFile(createPath, "");
    }
    return createPath;
  }

  private static async getOrCreateProjectConfigPath(
    create?: boolean,
  ): Promise<string> {
    const filename = `.${META.name}.yml`;
    return await this.getOrCreateProjectConfig(filename, create);
  }

  private static async getOrCreateLocalConfigPath(
    create?: boolean,
  ): Promise<string> {
    const filename = `.${META.name}.local.yml`;
    return await this.getOrCreateProjectConfig(filename, create);
  }

  static async getConfigPath(
    scopeFlag: ScopeFlag,
    create?: boolean,
  ): Promise<string> {
    if (scopeFlag.global) {
      return await this.getOrCreateGlobalConfigPath();
    } else if (scopeFlag.local) {
      return await this.getOrCreateLocalConfigPath(create);
    } else {
      return await this.getOrCreateProjectConfigPath(create);
    }
  }
}
