import { parseArgs } from "@std/cli";
import { BaseCommand, HelpOption, LocalOption, GlobalOption, type Command } from "../../lib/command.ts";
import { selectLanguage } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";
import type { ScopeFlag } from "../../type.ts";

const EditorCommandOption = {...HelpOption, ...LocalOption, ...GlobalOption};

type EditorCommandOptionType = typeof EditorCommandOption;

export class EditorCommand extends BaseCommand<EditorCommandOptionType> {
  name: string = "editor";
  description: string = "Configure the editor";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: string[],
    options: EditorCommandOptionType,
  ): Promise<void> {
    const parsedOptions = this.parseOptions(options);
    const parsedAlias = this.parseAlias(options);

    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: parsedOptions.booleanKeysArray,
      string: parsedOptions.stringKeysArray,
      // collect: parsedOptions.arrayKeysArray,
      alias: parsedAlias,
      stopEarly: true,
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    if (parsed.help) {
      this.help(context, options);
      return;
    }

    await this.action(parsed);
  }

  async action(scope: ScopeFlag) {
    const language = await selectLanguage();
    const localConfig = await getMergedConfig();
    localConfig.language = language;
    await saveConfig(localConfig, scope);
  }
}
