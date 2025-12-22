import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../services/config.ts";
import { OverviewInput } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../../type.ts";
import {
  ConfigCommandFlag,
  type ConfigCommandFlagType,
  ConfigCommandOption,
  type ConfigCommandOptionType,
} from "../config.ts";

export class OverviewCommand
  extends BaseCommand<ConfigCommandFlagType, ConfigCommandOptionType> {
  name: string = "overview";
  description: string = "Configure the overview";
  commands: Command[] = [];
  defaultFlags: ConfigCommandFlagType = ConfigCommandFlag;
  defaultOptions: ConfigCommandOptionType = ConfigCommandOption;

  async execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: ConfigCommandFlagType,
    options: ConfigCommandOptionType,
  ): Promise<void> {
    const parsed = this.parseArgs(remainingArgs, flags, options);

    if (parsed._.length > 0) {
      await this.executeSubCommand(
        parsed,
        consumedArgs,
        flags,
        options,
      );
      return;
    }

    if (parsed.help) {
      await this.help(consumedArgs);
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
