import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../services/config.ts";
import { OverviewInput } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../../type.ts";
import {
  GlobalFlag,
  HelpFlag,
  LocalFlag,
} from "../../constants/commands/flags.ts";

const OverviewCommandFlag = {
  ...HelpFlag,
  ...LocalFlag,
  ...GlobalFlag,
};
const OverviewCommandOption = {};

type OverviewCommandFlagType = typeof OverviewCommandFlag;
type OverviewCommandOptionType = typeof OverviewCommandOption;

export class OverviewCommand
  extends BaseCommand<OverviewCommandFlagType, OverviewCommandOptionType> {
  name: string = "overview";
  description: string = "Configure the overview";
  commands: Command[] = [];
  async execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: OverviewCommandFlagType,
    options: OverviewCommandOptionType,
  ): Promise<void> {
    const parsed = this.parseArgs(remainingArgs, flags, options);

    if (parsed._.length > 0) {
      await this.executeSubCommand(
        parsed._.map((arg) => arg.toString()),
        consumedArgs,
        flags,
        options,
      );
      return;
    }

    if (parsed.help) {
      await this.help(consumedArgs, remainingArgs, flags, options);
      return;
    }

    await this.action();
  }

  async action(scope: ScopeFlag = {}) {
    const { waitUntilExit } = render(
      React.createElement(OverviewInput, {
        onSubmit: async (overview: string) => {
          const localConfig = await getMergedConfig();
          localConfig.overview = overview;
          await saveConfig(localConfig, scope);
        },
      }),
    );
    await waitUntilExit();
  }
}
