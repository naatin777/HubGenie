import { BaseCommand, type Command, HelpOption } from "../lib/command.ts";
import { parseArgs } from "@std/cli";
import { Commit } from "../features/commit/ui.tsx";
import { render } from "ink";
import React from "react";

const CommitCommandOption = { ...HelpOption };

type CommitCommandOptionType = typeof CommitCommandOption;

export class CommitCommand extends BaseCommand<CommitCommandOptionType> {
  name: string = "commit";
  description: string = "Commit changes to the repository";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: (string | number)[],
    options: CommitCommandOptionType,
  ): Promise<void> {
    const parsedOptions = this.parseOptions(options);
    const parsedAlias = this.parseAlias(options);

    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: parsedOptions.booleanKeysArray,
      string: parsedOptions.stringKeysArray,
      // collect: parsedOptions.arrayKeysArray,
      alias: parsedAlias,
      stopEarly: true,
    });

    if (parsed._.length > 0) {
      await this.executeSubCommand(parsed._, context, options);
      return;
    }

    if (parsed.help) {
      await this.help(context, options);
      return;
    }

    await this.action();
  }

  async action() {
    const commit = React.createElement(Commit, null);
    const { waitUntilExit } = render(commit);
    await waitUntilExit();
  }
}
