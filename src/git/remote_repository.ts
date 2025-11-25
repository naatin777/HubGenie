import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitRemoteRepository {
  private readonly runner: GitRunner;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
  }

  async getOwnerAndRepo(): Promise<{ owner: string; repo: string }> {
    const command = await this.runner.run(["get-url", "origin"]);
    const match = command.match(/[:/]([^/:]+)\/([^/]+?)(?:\.git)?$/);
    if (!match) throw new Error("Invalid remote URL");
    return { owner: match[1], repo: match[2] };
  }
}
