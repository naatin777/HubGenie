import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { inputOverview } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";

const OverviewCommandOption = {
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
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(args);

    const overview = inputOverview();
    const localConfig = await getMergedConfig();
    localConfig.overview = overview;
    await saveConfig(localConfig, {
      local: parsed.local,
      global: parsed.global,
    });
  }
}
