import { parseArgs } from "@std/cli";
import { BaseCommand, HelpOption, LocalOption, GlobalOption, type Command } from "../lib/command.ts";
import { saveConfig } from "../utils/config.ts";
import {
  inputOverview,
  selectEditor,
  selectLanguage,
} from "../utils/selection.ts";
import { getConfig } from "../utils/config.ts";
import type { ScopeFlag } from "../type.ts";

const InitCommandOption = {...HelpOption, ...LocalOption, ...GlobalOption };

type InitCommandOptionType = typeof InitCommandOption;

export class InitCommand extends BaseCommand<InitCommandOptionType> {
  name: string = "init";
  description: string = "Initialize a new project";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: string[],
    options: InitCommandOptionType,
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

    if (parsed.help) {
      this.help(context, options);
      return;
    }

    await this.action(parsed);
  }

  async action(scope: ScopeFlag) {
    const config = await getConfig(scope);
    if (config) {
      console.error("Config already exists");
      return;
    }
    const language = await selectLanguage();
    const editor = selectEditor();
    const overview = inputOverview();
    await saveConfig({
      language: language,
      editor: editor,
      overview: overview,
    }, scope);
  }
}
