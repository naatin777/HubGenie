import { GitDiffRepository } from "./diff_repository.ts";
import { DefaultGitRunner, GitRunner } from "./git_runner.ts";

export class GitService {
    private readonly runner: GitRunner
    public readonly diff: GitDiffRepository;

    constructor(runner: GitRunner = new DefaultGitRunner()) {
        this.runner = runner;
        this.diff = new GitDiffRepository(this.runner);
    }
}
