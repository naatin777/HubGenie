export interface Command {
  name: string;
  description: string;
  commands: Command[];
  execute(
    args: (string | number)[],
    options: Record<string, unknown>,
  ): Promise<void>;
}

export abstract class BaseCommand implements Command {
  abstract name: string;
  abstract description: string;
  abstract commands: Command[];
  abstract execute(
    args: (string | number)[],
    options: Record<string, unknown>,
  ): Promise<void>;

  async executeSubCommand(
    args: (string | number)[],
    options: Record<string, unknown>,
  ): Promise<void> {
    const commandMap = new Map(
      this.commands.map((command) => [command.name, command]),
    );

    if (typeof args[0] === "string") {
      const command = commandMap.get(args[0]);
      await command?.execute(args.slice(1), options);
    }
  }
}
