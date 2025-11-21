import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitDiffRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async getGitDiffStaged(): Promise<string> {
    return await this.runner.run([
      "diff",
      "--cached",
      "--unified=0",
      "--color=never",
      "--no-prefix",
    ]);
  }

  async getGitDiffStagedName(): Promise<string> {
    return await this.runner.run([
      "diff",
      "--cached",
      "--name-only",
    ]);
  }

  async getStagedFileNames(): Promise<string[]> {
    const name = await this.getGitDiffStagedName();
    return name.split(/\r\n|\r|\n/).filter((value) => value);
  }

  async getGitDiffUnstaged(): Promise<string> {
    return await this.runner.run([
      "diff",
      "--unified=0",
      "--color=never",
      "--no-prefix",
    ]);
  }

  async getGitDiffUnstagedName(): Promise<string> {
    return await this.runner.run([
      "diff",
      "--name-only",
    ]);
  }

  async getUnStagedFileNames(): Promise<string[]> {
    const name = await this.getGitDiffUnstagedName();
    return name.split(/\r\n|\r|\n/).filter((value) => value);
  }
}
