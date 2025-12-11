import { bold, blue, green, yellow } from "@std/fmt/colors";

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
      await command?.execute(args.slice(1), [this.name, ...context], options);
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
    // ----------------------------------------------------
    // 1. Usage セクション
    // ----------------------------------------------------
    console.log(
      bold(blue("Usage:")) +
      ` ${context.join(" ")} ${this.commands.length === 0 ? "" : yellow("[command]")
      } ${yellow("[options]")}`,
    );

    // ----------------------------------------------------
    // 2. Commands セクション
    // ------------
    const rawCommandNames = this.commands.map(cmd => cmd.name);
    const maxRawCommandNameLength = rawCommandNames.reduce((max, name) => Math.max(max, name.length), 0);
    const commandPaddingLength = maxRawCommandNameLength + 4; // 固定の追加スペース

    console.log();
    console.log(bold(blue("Commands:")));
    console.log(
      this.commands.map((command) => {
        // 修正点: 色付け前にpadEndで必要なパディング量を計算
        const paddedName = command.name.padEnd(commandPaddingLength);

        // 修正点: パディング後に色付けを適用
        return `\t${green(paddedName)} ${command.description}`;
      }).join("\n"),
    );

    // ----------------------------------------------------
    // 3. Options セクション
    // ----------------------------------------------------

    let maxRawOptionLineLength = 0;
    const optionLines = Object.keys(options).map(key => {
      const option = options[key];

      // 修正点: 色付け前の生文字列の長さを計算
      const rawAliasPart = option.alias ? `, -${option.alias}` : '';
      const rawLine = `\t--${key}${rawAliasPart}`;

      maxRawOptionLineLength = Math.max(maxRawOptionLineLength, rawLine.length);

      // 表示用の色付けされた文字列を生成
      const aliasPart = option.alias ? `, ${green(`-${option.alias}`)}` : '';
      const coloredLine = `\t${green(`--${key}`)}${aliasPart}`;

      return { rawLine, coloredLine, description: option.description };
    });

    const descriptionStart = maxRawOptionLineLength + 4; // 最長行 + パディング

    console.log();
    console.log(bold(blue("Options:")));
    console.log(
      optionLines.map(item => {
        // 修正点: 色付けされた文字列に、計算されたパディング量でパディングを追加
        // パディングの量は rawLine の長さで計算されているため、色のエスケープコードを補正

        // パディング差分を計算: 目標位置から色付けされた文字列の見た目の長さを引く
        const currentLength = item.rawLine.length;
        const paddingNeeded = descriptionStart - currentLength;
        const padding = ' '.repeat(paddingNeeded);

        return `${item.coloredLine}${padding}${item.description}`;
      }).join("\n"),
    );


  }

}
