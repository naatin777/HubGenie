import { BaseCommand, type Command } from "../lib/command.ts";

export class InitCommand extends BaseCommand {
  name: string = "init";
  description: string = "Initialize a new project";
  commands: Command[] = [];
  async execute(args: (string | number)[]): Promise<void> {
    console.log(`${this.name}`);
    console.log(args);
  }
}
