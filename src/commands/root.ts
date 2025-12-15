import { parseArgs } from "@std/cli";
import {
  BaseCommand,
  type Command,
  HelpOption,
  VersionOption,
} from "../lib/command.ts";

type RootCommandInit = {
  name: string;
  description: string;
  version: string;
  commands: Command[];
};

const RootCommandOption = { ...HelpOption, ...VersionOption };

type RootCommandOptionType = typeof RootCommandOption;

export class RootCommand extends BaseCommand<RootCommandOptionType> {
  name: string;
  version: string;
  description: string;
  commands: Command[];

  constructor(options: RootCommandInit) {
    super();
    this.name = options.name;
    this.version = options.version;
    this.description = options.description;
    this.commands = options.commands;
  }

  async execute(
    args: (string | number)[],
    context: (string | number)[] = [],
    options: RootCommandOptionType = RootCommandOption,
  ): Promise<void> {
    context.push(this.name);

    const parsedOptions = this.parseOptions(options);
    const parsedAlias = this.parseAlias(options);

    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: parsedOptions.booleanKeysArray,
      string: parsedOptions.stringKeysArray,
      // collect: parsedOptions.arrayKeysArray,
      alias: parsedAlias,
      stopEarly: true,
    });

    if (parsed._.length > 0 && !parsed.version) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    if ((parsed.help || parsed._.length === 0) && !parsed.version) {
      await this.help(context, options);
      return;
    }

    if (parsed.version) {
      console.log(`version: ${this.version}`);
      return;
    }
  }
}
