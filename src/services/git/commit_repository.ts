import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitCommitRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async commitWithMessages(messages: string[]): Promise<string> {
    return await this.runner.run([
      "commit",
      ...messages.flatMap((message) => ["-m", message]),
    ]);
  }
}
