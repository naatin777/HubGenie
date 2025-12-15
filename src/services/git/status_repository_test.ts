import { assertEquals } from "@std/assert";
import type { GitRunner } from "./git_runner.ts";
import { GitStatusRepository } from "./status_repository.ts";

Deno.test("status", async () => {
  const mock: GitRunner = {
    run: (args) => new Promise((resolve) => resolve(args.join(" "))),
  };
  const gitStatusRepository = new GitStatusRepository(mock);
  const status = await gitStatusRepository.getStatus();
  assertEquals(status, "status");
});
