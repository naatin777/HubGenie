import { BaseCommand, type Command } from "../lib/command.ts";

export class ConfigCommand extends BaseCommand {
  name: string = "config";
  description: string = "Configure the repository";
  commands: Command[] = [];
  async execute(args: (string | number)[]): Promise<void> {
    console.log(`${this.name}`);
    console.log(args);
  }
}
