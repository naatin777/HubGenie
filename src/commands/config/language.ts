import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { selectEditor } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";

interface LanguageCommandOption {
  help: boolean;
  local: boolean;
  global: boolean;
  [key: string]: unknown;
}

export class LanguageCommand extends BaseCommand {
  name: string = "language";
  description: string = "Configure the language";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    options: LanguageCommandOption,
  ): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(parsed);

    const editor = selectEditor();
    const localConfig = await getMergedConfig();
    localConfig.editor = editor;
    await saveConfig(localConfig, options);
  }
}
