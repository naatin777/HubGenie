import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";

const ConfigCommandOption = {
  help: {
    value: false,
    description: "abcdefg",
    alias: "h",
  },
  local: {
    value: false,
    description: "aafff",
    alias: undefined,
  },
  global: {
    value: false,
    description: "aafff",
    alias: undefined,
  },
};

type ConfigCommandOptionType = typeof ConfigCommandOption;

export class ConfigCommand extends BaseCommand<ConfigCommandOptionType> {
  name: string = "config";
  description: string = "Configure the repository";
  commands: Command[] = [];

  constructor({ subCommands }: { subCommands: Command[] }) {
    super();
    this.commands = subCommands;
  }

  async execute(
    args: (string | number)[],
    context: string[],
    options: ConfigCommandOptionType,
  ): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(parsed);
  }
}
