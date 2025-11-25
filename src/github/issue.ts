import { GitService } from "../git/git_service.ts";
import { getGitHubToken } from "../utils/env.ts";
import { Octokit } from "octokit";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";

export async function createIssue(
  title: string,
  body: string,
): Promise<RestEndpointMethodTypes["issues"]["create"]["response"]> {
  const gitHubToken = await getGitHubToken();
  const gitService = new GitService();
  const { owner, repo } = await gitService.remote.getOwnerAndRepo();
  const octokit = new Octokit({ auth: gitHubToken });

  const issue: RestEndpointMethodTypes["issues"]["create"]["response"] =
    await octokit.rest.issues.create({
      owner,
      repo,
      title: title,
      body: body,
    });

  return issue;
}
