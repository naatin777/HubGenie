import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { selectLanguage } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";

interface EditorCommandOption {
  help: boolean;
  local: boolean;
  global: boolean;
  [key: string]: unknown;
}

export class EditorCommand extends BaseCommand {
  name: string = "editor";
  description: string = "Configure the editor";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    options: EditorCommandOption,
  ): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(args);

    const language = await selectLanguage();
    const localConfig = await getMergedConfig();
    localConfig.language = language;
    await saveConfig(localConfig, options);
  }
}
