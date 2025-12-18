import React from "react";
import { Help } from "../features/help/ui.tsx";
import { render } from "ink";

export type OptionType = Record<string, {
  value: boolean | string | string[] | undefined;
  description: string;
  alias: string | undefined;
}>;

export interface Command {
  name: string;
  description: string;
  commands: Command[];
  execute(
    args: (string | number)[],
    context: (string | number)[],
    options: OptionType,
  ): Promise<void>;
}

export abstract class BaseCommand<T extends OptionType> implements Command {
  abstract name: string;
  abstract description: string;
  abstract commands: Command[];
  abstract execute(
    args: (string | number)[],
    context: (string | number)[],
    options: T,
  ): Promise<void>;

  async executeSubCommand(
    args: (string | number)[],
    context: (string | number)[],
    options: T,
  ): Promise<void> {
    const commandMap = new Map(
      this.commands.map((command) => [command.name, command]),
    );

    if (typeof args[0] === "string") {
      const command = commandMap.get(args[0]);
      if (command) {
        await command.execute(args.slice(1), [...context, args[0]], options);
      } else {
        console.error(`Command "${args[0]}" not found.\n`);
        await this.help(context, options);
      }
    }
  }

  parseOptions(options: T) {
    type OptionKeys = keyof T & string;
    type KeyOfType<U> = {
      [P in OptionKeys]: T[P]["value"] extends U ? P : never;
    }[OptionKeys];
    type BooleanKeys = KeyOfType<boolean>;
    type StringKeys = KeyOfType<string>;
    type ArrayKeys = KeyOfType<string[]>;
    type FallbackToStringArray<T extends PropertyKey> = [T] extends [never]
      ? readonly string[]
      : readonly T[];
    const booleanKeysArray: BooleanKeys[] = [];
    const stringKeysArray: StringKeys[] = [];
    const arrayKeysArray: ArrayKeys[] = [];
    const keys = Object.keys(options) as OptionKeys[];
    keys.forEach((key) => {
      const value = options[key].value;
      if (typeof value === "boolean") {
        booleanKeysArray.push(key as BooleanKeys);
      } else if (typeof value === "string" && !Array.isArray(value)) {
        stringKeysArray.push(key as StringKeys);
      } else if (Array.isArray(value)) {
        arrayKeysArray.push(key as ArrayKeys);
      }
    });
    return {
      booleanKeysArray: booleanKeysArray as FallbackToStringArray<
        KeyOfType<boolean>
      >,
      stringKeysArray: stringKeysArray as FallbackToStringArray<
        KeyOfType<string>
      >,
      arrayKeysArray: arrayKeysArray as FallbackToStringArray<
        KeyOfType<string[]>
      >,
    };
  }

  parseAlias(options: T) {
    type AliasToKeyType = {
      [P in keyof T as T[P]["alias"] extends string ? T[P]["alias"] : never]: P;
    };
    const keys = Object.keys(options) as (keyof T)[];
    const result = keys.reduce((acc, key) => {
      const alias = options[key].alias;
      if (typeof alias === "string") {
        acc[alias] = key;
      }
      return acc;
    }, {} as Record<string, keyof T>);
    return result as AliasToKeyType;
  }

  async help(
    context: (string | number)[],
    options: T,
  ): Promise<void> {
    const help = React.createElement(Help, {
      name: this.name,
      description: this.description,
      context,
      options,
      commands: this.commands,
    });

    const { waitUntilExit } = render(help);
    await waitUntilExit();
  }
}
