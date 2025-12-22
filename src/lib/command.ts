import { parseArgs } from "@std/cli";
import React from "react";
import { Help } from "../features/help/ui.tsx";
import { render } from "ink";

export type FlagType = Record<string, {
  value: boolean;
  description: string;
  alias: string | undefined;
}>;

export type OptionType = Record<string, {
  value: string;
  description: string;
  alias: string | undefined;
}>;

export interface Command {
  name: string;
  description: string;
  commands: Command[];
  execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: FlagType,
    options: OptionType,
  ): Promise<void>;
}

export abstract class BaseCommand<
  F extends FlagType,
  O extends OptionType,
> implements Command {
  abstract name: string;
  abstract description: string;
  abstract commands: Command[];
  abstract execute(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: F,
    options: O,
  ): Promise<void>;

  async executeSubCommand(
    remainingArgs: string[],
    consumedArgs: string[],
    flags: F,
    options: O,
  ): Promise<void> {
    const command = this.commands.find((command) =>
      command.name === remainingArgs[0]
    );

    if (command) {
      await command.execute(
        remainingArgs.slice(1),
        [...consumedArgs, this.name],
        flags,
        options,
      );
    } else {
      console.error(`Command "${remainingArgs[0]}" not found.\n`);
      await this.help(consumedArgs, remainingArgs, flags, options);
    }
  }
  parseArgs(remainingArgs: string[], flags: F, options: O) {
    type FlagKeys = keyof F & string;
    type OptionKeys = keyof O & string;
    const flagKeys = Object.keys(flags ?? {}) as FlagKeys[];
    const optionKeys = Object.keys(options ?? {}) as OptionKeys[];
    const alias = Object.fromEntries([
      ...flagKeys.flatMap((key) => {
        const alias = flags[key].alias;
        return alias ? [[alias, key]] : [];
      }),
      ...optionKeys.flatMap((key) => {
        const alias = options[key].alias;
        return alias ? [[alias, key]] : [];
      }),
    ]);
    const defaults = {
      ...Object.fromEntries(
        flagKeys.map((key) => [key, flags[key].value]),
      ),
      ...Object.fromEntries(
        optionKeys.map((key) => [key, options[key].value]),
      ),
    };

    return parseArgs(remainingArgs, {
      boolean: flagKeys,
      string: optionKeys,
      alias: alias,
      // deno-lint-ignore no-explicit-any
      default: defaults as any,
      stopEarly: true,
    });
  }

  async help(
    _remainingArgs: string[],
    consumedArgs: string[],
    _flags: F,
    options: O,
  ): Promise<void> {
    const help = React.createElement(Help, {
      name: this.name,
      description: this.description,
      context: consumedArgs,
      options,
      commands: this.commands,
    });

    const { waitUntilExit } = render(help);
    await waitUntilExit();
  }
}
