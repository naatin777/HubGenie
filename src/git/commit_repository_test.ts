import { assertEquals } from "@std/assert";
import { GitRunner } from "./git_runner.ts";
import { GitCommitRepository } from "./commit_repository.ts";

Deno.test("commitWithMessage", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitCommitRepository = new GitCommitRepository(mock);
  const result = await gitCommitRepository.commitWithMessage("test");
  assertEquals(result, "commit -m test");
});
