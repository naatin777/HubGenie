import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../services/config.ts";
import { EditorSelector } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import {
  ConfigCommandFlag,
  type ConfigCommandFlagType,
  ConfigCommandOption,
  type ConfigCommandOptionType,
} from "../config.ts";

export class EditorCommand
  extends BaseCommand<ConfigCommandFlagType, ConfigCommandOptionType> {
  name: string = "editor";
  description: string = "Configure the editor";
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

    const { waitUntilExit } = render(
      React.createElement(EditorSelector, {
        onSelect: async (editor: string) => {
          const localConfig = await getMergedConfig();
          localConfig.editor = editor;
          await saveConfig(localConfig, {});
        },
      }),
    );
    await waitUntilExit();
  }
}
