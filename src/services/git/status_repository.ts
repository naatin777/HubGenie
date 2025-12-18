import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitStatusRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async getStatus(): Promise<string> {
    return await this.runner.run([
      "status",
    ]);
  }
}
