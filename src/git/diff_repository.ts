import { DefaultGitRunner, GitRunner } from "./git_runner.ts";

export class GitDiffRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async getGitDiffStaged(
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

  async getGitDiffStagedName(
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
    const name = await this.getGitDiffStagedName(runner);
    return name.split(/\r\n|\r|\n/).filter((value) => value);
  }

  async getGitDiffUnstaged(
    runner: GitRunner = new DefaultGitRunner(),
  ): Promise<string> {
    return await runner.run([
      "diff",
      "--unified=0",
      "--color=never",
      "--no-prefix",
    ]);
  }

  async getGitDiffUnstagedName(
    runner: GitRunner = new DefaultGitRunner(),
  ): Promise<string> {
    return await runner.run([
      "diff",
      "--name-only",
    ]);
  }

  async getUnStagedFileNames(
    runner: GitRunner = new DefaultGitRunner(),
  ): Promise<string[]> {
    const name = await this.getGitDiffUnstagedName(runner);
    return name.split(/\r\n|\r|\n/).filter((value) => value);
  }
}
