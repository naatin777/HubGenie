import { assertEquals } from "@std/assert";
import type { GitRunner } from "./git_runner.ts";
import { GitRevParseRepository } from "./rev_parse_repository.ts";

Deno.test("isGitRepository", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitRevParseRepository = new GitRevParseRepository(mock);
  const isGitRepository = await gitRevParseRepository.isGitRepository();
  assertEquals(isGitRepository, false);

  const mock2: GitRunner = {
    run: (_) => new Promise((resolve) => resolve("true")),
  };
  const gitRevParseRepository2 = new GitRevParseRepository(mock2);
  const isGitRepository2 = await gitRevParseRepository2.isGitRepository();
  assertEquals(isGitRepository2, true);
});
