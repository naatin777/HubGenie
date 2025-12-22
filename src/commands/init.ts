import { BaseCommand, type Command } from "../lib/command.ts";
import { getConfig } from "../services/config.ts";
import { SetupFlow } from "../components/setup_flow.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../type.ts";
import {
  GlobalFlag,
  HelpFlag,
  LocalFlag,
} from "../constants/commands/flags.ts";

const InitCommandFlag = { ...HelpFlag, ...LocalFlag, ...GlobalFlag };
const InitCommandOption = {};

type InitCommandFlagType = typeof InitCommandFlag;
type InitCommandOptionType = typeof InitCommandOption;

export class InitCommand
  extends BaseCommand<InitCommandFlagType, InitCommandOptionType> {
  name: string = "init";
  description: string = "Initialize a new project";
  commands: Command[] = [];
  defaultFlags: InitCommandFlagType = InitCommandFlag;
  defaultOptions: InitCommandOptionType = InitCommandOption;

  async execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: InitCommandFlagType,
    options: InitCommandOptionType,
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
      await this.help(consumedArgs);
      return;
    }

    await this.action();
  }

  async action(scope: ScopeFlag = {}) {
    const config = await getConfig(scope);
    if (config) {
      console.error("Config already exists");
      return;
    }
    const { waitUntilExit } = render(React.createElement(SetupFlow, { scope }));
    await waitUntilExit();
  }
}
