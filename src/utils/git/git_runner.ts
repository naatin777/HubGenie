export interface GitRunner {
  run(args: string[]): Promise<string>;
}

export class DefaultGitRunner implements GitRunner {
  async run(args: string[]): Promise<string> {
    const cmd = new Deno.Command("git", {
      args,
      stdout: "piped",
    });
    const output = await cmd.output();
    return new TextDecoder().decode(output.stdout);
  }
}
