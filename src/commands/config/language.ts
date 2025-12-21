import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../utils/config.ts";
import { LanguageSelector } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../../type.ts";
import {
  GlobalOption,
  HelpOption,
  LocalOption,
} from "../../constants/option.ts";

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
    context: (string | number)[],
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
      await this.help(context, options);
      return;
    }

    await this.action(parsed);
  }

  async action(scope: ScopeFlag) {
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
