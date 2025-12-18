import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";
import { GlobalOption, HelpOption, LocalOption } from "../constants/option.ts";

const ConfigCommandOption = { ...HelpOption, ...LocalOption, ...GlobalOption };

type ConfigCommandOptionType = typeof ConfigCommandOption;

export class ConfigCommand extends BaseCommand<ConfigCommandOptionType> {
  name: string = "config";
  description: string = "Configure the repository";
  commands: Command[] = [];

  constructor({ subCommands }: { subCommands: Command[] }) {
    super();
    this.commands = subCommands;
  }

  async execute(
    args: (string | number)[],
    context: (string | number)[],
    options: ConfigCommandOptionType,
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

    await this.help(context, options);
  }
}
