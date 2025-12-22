import { HelpFlag, VersionFlag } from "../constants/commands/flags.ts";
import { BaseCommand, type Command } from "../lib/command.ts";

type RootCommandInit = {
  name: string;
  description: string;
  version: string;
  commands: Command[];
};

const RootCommandFlag = { ...HelpFlag, ...VersionFlag };
const RootCommandOption = {};

type RootCommandFlagType = typeof RootCommandFlag;
type RootCommandOptionType = typeof RootCommandOption;

export class RootCommand
  extends BaseCommand<RootCommandFlagType, RootCommandOptionType> {
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
    remainingArgs: string[],
    consumedArgs: string[] = [this.name],
    flags: RootCommandFlagType = RootCommandFlag,
    options: RootCommandOptionType = RootCommandOption,
  ): Promise<void> {
    const parsed = this.parseArgs(remainingArgs, flags, options);

    if (parsed._.length > 0 && !parsed.version) {
      await this.executeSubCommand(
        parsed._.map((arg) => arg.toString()),
        consumedArgs,
        flags,
        options,
      );
      return;
    }

    if ((parsed.help || parsed._.length === 0) && !parsed.version) {
      await this.help(remainingArgs, consumedArgs, flags, options);
      return;
    }

    if (parsed.version) {
      console.log(`version: ${this.version}`);
      return;
    }
  }
}
