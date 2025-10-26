import { join } from "@std/path";
import { ensureDir } from "@std/fs";
import { ConfigScope } from "../type.ts";
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

  static getConfigPath(scope: ConfigScope): string {
    return scope === "local"
      ? this.getLocalConfigPath()
      : this.getGlobalConfigPath();
  }

  static async ensureConfigDir(scope: ConfigScope): Promise<void> {
    if (scope === "global") {
      await ensureDir(this.getGlobalConfigDir());
    }
  }
}
