import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { selectEditor } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";

const LanguageCommandOption = {
  help: {
    value: false,
    description: "abcdefg",
    alias: "h",
  },
  local: {
    value: false,
    description: "aafff",
    alias: undefined,
  },
  global: {
    value: false,
    description: "aafff",
    alias: undefined,
  },
};

type LanguageCommandOptionType = typeof LanguageCommandOption;

export class LanguageCommand extends BaseCommand<LanguageCommandOptionType> {
  name: string = "language";
  description: string = "Configure the language";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: string[],
    options: LanguageCommandOptionType,
  ): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(parsed);

    const editor = selectEditor();
    const localConfig = await getMergedConfig();
    localConfig.editor = editor;
    await saveConfig(localConfig, {
      local: parsed.local,
      global: parsed.global,
    });
  }
}
