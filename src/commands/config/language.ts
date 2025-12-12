import { parseArgs } from "@std/cli";
import {
  BaseCommand,
  type Command,
  GlobalOption,
  HelpOption,
  LocalOption,
} from "../../lib/command.ts";
import { selectEditor } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";
import type { ScopeFlag } from "../../type.ts";

const LanguageCommandOption = {
  ...HelpOption,
  ...LocalOption,
  ...GlobalOption,
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
    const editor = selectEditor();
    const localConfig = await getMergedConfig();
    localConfig.editor = editor;
    await saveConfig(localConfig, scope);
  }
}
