import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import { META } from "../meta.ts";

export class ConfigPaths {
  private static getGlobalConfigDir(): string {
    const home = Deno.env.get("HOME") || Deno.env.get("USERPROFILE");
    if (!home) {
      throw new Error("Home directory not found");
    }
    return join(home, ".config", META.name);
  }

  private static getGlobalConfigPath(): string {
    return join(this.getGlobalConfigDir(), "config.json");
  }

  private static getLocalConfigPath(): string {
    return join(Deno.cwd(), `.${META.name}.json`);
  }

  static getConfigPath(global?: true | undefined): string {
    return global ? this.getGlobalConfigPath() : this.getLocalConfigPath();
  }

  static async ensureConfigDir(global?: true | undefined): Promise<void> {
    if (global) {
      await ensureDir(this.getGlobalConfigDir());
    }
  }
}
