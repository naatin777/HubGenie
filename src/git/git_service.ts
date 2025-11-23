import { GitCommitRepository } from "./commit_repository.ts";
import { GitDiffRepository } from "./diff_repository.ts";
import { DefaultGitRunner, type GitRunner } from "./git_runner.ts";
import { GitRevParseRepository } from "./rev_parse_repository.ts";
import { GitStatusRepository } from "./status_repository.ts";

export class GitService {
  private readonly runner: GitRunner;
  public readonly diff: GitDiffRepository;
  public readonly commit: GitCommitRepository;
  public readonly rev_parse: GitRevParseRepository;
  public readonly status: GitStatusRepository;

  constructor(runner: GitRunner = new DefaultGitRunner()) {
    this.runner = runner;
    this.diff = new GitDiffRepository(this.runner);
    this.commit = new GitCommitRepository(this.runner);
    this.rev_parse = new GitRevParseRepository(this.runner);
    this.status = new GitStatusRepository(this.runner);
  }
}
