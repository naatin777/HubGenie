import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";

type RootCommandInit = {
  name: string;
  description: string;
  version: string;
  commands: Command[];
};

interface RootCommandOption {
  help: boolean;
  version: boolean;
  [key: string]: unknown;
}

export class RootCommand extends BaseCommand {
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
    options: RootCommandOption,
  ): Promise<void> {
    if (options.version) {
      console.log(`version: ${this.version}`);
      return;
    }

    if (options.help) {
      console.log(`help: ${this.name}`);
      return;
    }

    if (args.length > 0) {
      await this.executeSubCommand(args, options);
      return;
    }
  }

  async run(args: string[]) {
    const parsed = parseArgs(args, {
      boolean: ["help", "version"],
      alias: { h: "help", v: "version" },
      stopEarly: true,
    });
    await this.execute(parsed._, parsed);
  }
}
