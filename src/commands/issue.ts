import { BaseCommand, type Command } from "../lib/command.ts";

export class IssueCommand extends BaseCommand {
  name: string = "issue";
  description: string = "Manage issues in the repository";
  commands: Command[] = [];
  async execute(args: (string | number)[]): Promise<void> {
    console.log(`${this.name}`);
    console.log(args);
  }
}
