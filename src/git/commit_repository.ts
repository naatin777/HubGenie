import { DefaultGitRunner, GitRunner } from "./git_runner.ts";

export class GitCommitRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async commitWithMessage(message: string): Promise<string> {
    return await this.runner.run(["commit", "-m", message]);
  }
}
