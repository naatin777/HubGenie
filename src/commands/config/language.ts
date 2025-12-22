import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../services/config.ts";
import { LanguageSelector } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../../type.ts";
import {
  GlobalFlag,
  HelpFlag,
  LocalFlag,
} from "../../constants/commands/flags.ts";

const LanguageCommandFlag = {
  ...HelpFlag,
  ...LocalFlag,
  ...GlobalFlag,
};
const LanguageCommandOption = {};

type LanguageCommandFlagType = typeof LanguageCommandFlag;
type LanguageCommandOptionType = typeof LanguageCommandOption;

export class LanguageCommand
  extends BaseCommand<LanguageCommandFlagType, LanguageCommandOptionType> {
  name: string = "language";
  description: string = "Configure the language";
  commands: Command[] = [];
  async execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: LanguageCommandFlagType,
    options: LanguageCommandOptionType,
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
      React.createElement(LanguageSelector, {
        onSelect: async (language: string) => {
          const localConfig = await getMergedConfig();
          localConfig.language = language;
          await saveConfig(localConfig, scope);
        },
      }),
    );
    await waitUntilExit();
  }
}
