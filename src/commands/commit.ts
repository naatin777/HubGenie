import { commitAction } from "../actions/commit.ts";
import { BaseCommand, type Command } from "../lib/command.ts";

export class CommitCommand extends BaseCommand {
  name: string = "commit";
  description: string = "Commit changes to the repository";
  commands: Command[] = [];
  async execute(args: (string | number)[]): Promise<void> {
    await commitAction();
  }
}
