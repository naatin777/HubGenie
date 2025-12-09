import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";

interface ConfigCommandOption {
  help: boolean;
  local: boolean;
  global: boolean;
  [key: string]: unknown;
}

export class ConfigCommand extends BaseCommand {
  name: string = "config";
  description: string = "Configure the repository";
  commands: Command[] = [];

  constructor({ subCommands }: { subCommands: Command[] }) {
    super();
    this.commands = subCommands;
  }

  async execute(
    args: (string | number)[],
    options: ConfigCommandOption,
  ): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, options);
      return;
    }

    console.log(`${this.name}`);
    console.log(parsed);
  }
}
