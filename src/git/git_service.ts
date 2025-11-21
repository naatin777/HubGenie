import { GitCommitRepository } from "./commit_repository.ts";
import { GitDiffRepository } from "./diff_repository.ts";
import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";

export class GitService {
  private readonly runner: GitRunner;
  public readonly diff: GitDiffRepository;
  public readonly commit: GitCommitRepository;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
    this.diff = new GitDiffRepository(this.runner);
    this.commit = new GitCommitRepository(this.runner);
  }
}
