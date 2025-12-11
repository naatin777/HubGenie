import { parseArgs } from "@std/cli";
import { BaseCommand, HelpOption, LocalOption, GlobalOption, type Command } from "../../lib/command.ts";
import { inputOverview } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";
import type { ScopeFlag } from "../../type.ts";

const OverviewCommandOption = {...HelpOption, ...LocalOption, ...GlobalOption};

type OverviewCommandOptionType = typeof OverviewCommandOption;

export class OverviewCommand extends BaseCommand<OverviewCommandOptionType> {
  name: string = "overview";
  description: string = "Configure the overview";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: string[],
    options: OverviewCommandOptionType,
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

    await this.action(parsed);
  }

  async action(scope: ScopeFlag) {
    const overview = inputOverview();
    const localConfig = await getMergedConfig();
    localConfig.overview = overview;
    await saveConfig(localConfig, scope);
  }
}
