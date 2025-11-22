import { assertEquals } from "@std/assert";
import type { GitRunner } from "./git_runner.ts";
import { GitCommitRepository } from "./commit_repository.ts";

Deno.test("commitWithMessage", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitCommitRepository = new GitCommitRepository(mock);
  const result = await gitCommitRepository.commitWithMessages(["test"]);
  assertEquals(result, "commit -m test");
  const result2 = await gitCommitRepository.commitWithMessages([
    "test",
    "test2",
  ]);
  assertEquals(result2, "commit -m test -m test2");
});
