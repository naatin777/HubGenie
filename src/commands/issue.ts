import { BaseCommand, type Command } from "../lib/command.ts";
import { parseArgs } from "@std/cli";
import { Issue } from "../features/issue/ui.tsx";
import { render } from "ink";
import React from "react";
import { HelpOption } from "../constants/option.ts";

const IssueCommandOption = { ...HelpOption };

type IssueCommandOptionType = typeof IssueCommandOption;

export class IssueCommand extends BaseCommand<IssueCommandOptionType> {
  name: string = "issue";
  description: string = "Manage issues in the repository";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    context: (string | number)[],
    options: IssueCommandOptionType,
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

    if (parsed.help) {
      await this.help(context, options);
      return;
    }

    await this.action();
  }

  async action() {
    const issue = React.createElement(Issue, null);
    const { waitUntilExit } = render(issue);
    await waitUntilExit();
  }
}
