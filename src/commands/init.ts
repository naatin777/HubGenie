import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";
import { getConfig } from "../services/config.ts";
import { SetupFlow } from "../components/setup_flow.tsx";
import { render } from "ink";
import React from "react";
import type { ScopeFlag } from "../type.ts";
import { GlobalOption, HelpOption, LocalOption } from "../constants/option.ts";

const InitCommandOption = { ...HelpOption, ...LocalOption, ...GlobalOption };

type InitCommandOptionType = typeof InitCommandOption;

export class InitCommand extends BaseCommand<InitCommandOptionType> {
  name: string = "init";
  description: string = "Initialize a new project";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: (string | number)[],
    options: InitCommandOptionType,
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

    if (parsed.help) {
      await this.help(context, options);
      return;
    }

    await this.action(parsed);
  }

  async action(scope: ScopeFlag) {
    const config = await getConfig(scope);
    if (config) {
      console.error("Config already exists");
      return;
    }
    const { waitUntilExit } = render(React.createElement(SetupFlow, { scope }));
    await waitUntilExit();
  }
}
