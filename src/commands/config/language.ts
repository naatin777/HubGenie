import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../../lib/command.ts";

export class LanguageCommand extends BaseCommand {
  name: string = "language";
  description: string = "Configure the language";
  commands: Command[] = [];
  async execute(args: (string | number)[]): Promise<void> {
    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global"],
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._);
      return;
    }

    console.log(`${this.name}`);
    console.log(args);
  }
}
