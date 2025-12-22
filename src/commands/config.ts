import { BaseCommand, type Command } from "../lib/command.ts";
import {
  GlobalFlag,
  HelpFlag,
  LocalFlag,
} from "../constants/commands/flags.ts";

const ConfigCommandFlag = { ...HelpFlag, ...LocalFlag, ...GlobalFlag };
const ConfigCommandOption = {};

type ConfigCommandFlagType = typeof ConfigCommandFlag;
type ConfigCommandOptionType = typeof ConfigCommandOption;

export class ConfigCommand
  extends BaseCommand<ConfigCommandFlagType, ConfigCommandOptionType> {
  name: string = "config";
  description: string = "Configure the repository";
  commands: Command[] = [];

  constructor(subCommands: Command[]) {
    super();
    this.commands = subCommands;
  }

  async execute(
    remainingArgs: string[],
    consumedArgs: string[] = [this.name],
    flags: ConfigCommandFlagType,
    options: ConfigCommandOptionType,
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

    await this.help(consumedArgs, remainingArgs, flags, options);
  }
}
