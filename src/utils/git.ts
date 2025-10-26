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

export async function getGitDiff(
  runner: GitRunner = new DefaultGitRunner(),
): Promise<string> {
  return await runner.run([
    "diff",
    "--cached",
    "--unified=0",
    "--color=never",
    "--no-prefix",
  ]);
}
