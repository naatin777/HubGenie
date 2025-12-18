import { assertEquals, assertRejects } from "@std/assert";
import type { GitRunner } from "./git_runner.ts";
import { GitRemoteRepository } from "./remote_repository.ts";

Deno.test("getOwnerAndRepo", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitRemoteRepository = new GitRemoteRepository(mock);
  await assertRejects(
    async () => await gitRemoteRepository.getOwnerAndRepo(),
    Error,
    "Invalid remote URL",
  );

  const mock2: GitRunner = {
    run: (_) =>
      new Promise((resolve) =>
        resolve("git@github.com:naatin777/DemmitHub.git")
      ),
  };
  const gitRemoteRepository2 = new GitRemoteRepository(mock2);
  const { owner, repo } = await gitRemoteRepository2.getOwnerAndRepo();
  assertEquals(owner, "naatin777");
  assertEquals(repo, "DemmitHub");
});
