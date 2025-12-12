import { blue, bold, green, yellow } from "@std/fmt/colors";

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

export const HelpOption = {
  help: {
    value: false,
    description: "Show help information.",
    alias: "h",
  },
};

export const VersionOption = {
  version: {
    value: false,
    description: "Show version information.",
    alias: "v",
  },
};

export const GlobalOption = {
  global: {
    value: false,
    description: "Set global settings.",
    alias: undefined,
  },
};

export const LocalOption = {
  local: {
    value: false,
    description: "Set local settings.",
    alias: undefined,
  },
};

export abstract class BaseCommand<T extends OptionType> implements Command {
  abstract name: string;
  abstract description: string;
  abstract commands: Command[];
  abstract execute(
    args: (string | number)[],
    context: string[],
    options: T,
  ): Promise<void>;

  async executeSubCommand(
    args: (string | number)[],
    context: string[],
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
        this.help(context, options);
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

  help(context: string[], options: T): void {
    const hasCommands = this.commands.length > 0;
    const optionKeys = Object.keys(options);
    const hasOptions = optionKeys.length > 0;

    console.log(
      bold(blue("Usage:")) +
        ` ${context.join(" ")}` +
        (hasCommands ? ` ${yellow("[command]")}` : "") +
        (hasOptions ? ` ${yellow("[options]")}` : ""),
    );

    if (hasCommands) {
      const rawCommandNames = this.commands.map((cmd) => cmd.name);
      const maxRawCommandNameLength = rawCommandNames.reduce(
        (max, name) => Math.max(max, name.length),
        0,
      );
      const commandPaddingLength = maxRawCommandNameLength + 4;

      console.log();
      console.log(bold(blue("Commands:")));
      console.log(
        this.commands.map((command) => {
          const paddedName = command.name.padEnd(commandPaddingLength);
          return `\t${green(paddedName)} ${command.description}`;
        }).join("\n"),
      );
    }

    if (hasOptions) {
      let maxRawOptionLineLength = 0;
      const optionLines = optionKeys.map((key) => {
        const option = options[key];

        const rawAliasPart = option.alias ? `, -${option.alias}` : "";
        const rawLine = `\t--${key}${rawAliasPart}`;

        maxRawOptionLineLength = Math.max(
          maxRawOptionLineLength,
          rawLine.length,
        );

        const aliasPart = option.alias ? `, ${green(`-${option.alias}`)}` : "";
        const coloredLine = `\t${green(`--${key}`)}${aliasPart}`;

        return { rawLine, coloredLine, description: option.description };
      });

      const descriptionStart = maxRawOptionLineLength + 4;

      console.log();
      console.log(bold(blue("Options:")));
      console.log(
        optionLines.map((item) => {
          const currentLength = item.rawLine.length;
          const paddingNeeded = descriptionStart - currentLength;
          const padding = " ".repeat(paddingNeeded);
          return `${item.coloredLine}${padding}${item.description}`;
        }).join("\n"),
      );
    }
  }
}
