import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitRevParseRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async isGitRepository(): Promise<boolean> {
    try {
      const command = await this.runner.run([
        "rev-parse",
        "--is-inside-work-tree",
      ]);
      if (command === "true") {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
