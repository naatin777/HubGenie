import { DefaultGitRunner, GitRunner } from "./git_runner.ts";

export class GitDiffRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async getGitDiff(
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

  async getGitDiffName(
    runner: GitRunner = new DefaultGitRunner(),
  ): Promise<string> {
    return await runner.run([
      "diff",
      "--cached",
      "--name-only",
    ]);
  }

  async getStagedFileNames(
    runner: GitRunner = new DefaultGitRunner(),
  ): Promise<string[]> {
    const name = await this.getGitDiffName(runner);
    return name.split(/\r\n|\r|\n/).filter((value) => value);
  }
}
