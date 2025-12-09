import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";

type RootCommandOption = {
  name: string;
  description: string;
  version: string;
  commands: Command[];
};

export class RootCommand extends BaseCommand {
  name: string;
  version: string;
  description: string;
  commands: Command[];

  constructor(options: RootCommandOption) {
    super();
    this.name = options.name;
    this.version = options.version;
    this.description = options.description;
    this.commands = options.commands;
  }

  async execute(args: (string | number)[]): Promise<void> {
    console.log(`help: ${this.name}`);
    console.log(args);
  }

  async run(args: string[]) {
    const parsed = parseArgs(args, {
      boolean: ["help", "version"],
      alias: { h: "help", v: "version" },
      stopEarly: true,
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._);
      return;
    }

    if (parsed.help) {
      console.log(`help: ${this.name}`);
      return;
    }

    if (parsed.version) {
      console.log(`version: ${this.version}`);
      return;
    }

    if (parsed._.length === 0) {
      this.execute(parsed._);
      return;
    }
  }
}
