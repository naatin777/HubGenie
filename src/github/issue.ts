import { GitService } from "../git/git_service.ts";
import { getGitHubToken } from "../utils/env.ts";
import { Octokit } from "octokit";
import type { IssueCreateResponse } from "../type.ts";

export async function createIssue(
  title: string,
  body: string,
): Promise<IssueCreateResponse> {
  const gitHubToken = await getGitHubToken();
  const gitService = new GitService();
  const { owner, repo } = await gitService.remote.getOwnerAndRepo();
  const octokit = new Octokit({ auth: gitHubToken });

  const issue: IssueCreateResponse = await octokit.rest.issues.create({
    owner,
    repo,
    title: title,
    body: body,
  });

  return issue;
}
