import { BaseCommand, type Command } from "../../lib/command.ts";
import { getMergedConfig, saveConfig } from "../../services/config.ts";
import { EditorSelector } from "../../components/selection.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../../type.ts";
import {
  GlobalFlag,
  HelpFlag,
  LocalFlag,
} from "../../constants/commands/flags.ts";

const EditorCommandFlag = { ...HelpFlag, ...LocalFlag, ...GlobalFlag };
const EditorCommandOption = {};

type EditorCommandFlagType = typeof EditorCommandFlag;
type EditorCommandOptionType = typeof EditorCommandOption;

export class EditorCommand
  extends BaseCommand<EditorCommandFlagType, EditorCommandOptionType> {
  name: string = "editor";
  description: string = "Configure the editor";
  commands: Command[] = [];
  async execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: EditorCommandFlagType,
    options: EditorCommandOptionType,
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
      React.createElement(EditorSelector, {
        onSelect: async (editor: string) => {
          const localConfig = await getMergedConfig();
          localConfig.editor = editor;
          await saveConfig(localConfig, scope);
        },
      }),
    );
    await waitUntilExit();
  }
}
