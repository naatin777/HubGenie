import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { inputOverview } from "../../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";

interface OverviewCommandOption {
  help: boolean;
  local: boolean;
  global: boolean;
  [key: string]: unknown;
}

export class OverviewCommand extends BaseCommand {
  name: string = "overview";
  description: string = "Configure the overview";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    options: OverviewCommandOption,
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

    const overview = inputOverview();
    const localConfig = await getMergedConfig();
    localConfig.overview = overview;
    await saveConfig(localConfig, options);
  }
}
