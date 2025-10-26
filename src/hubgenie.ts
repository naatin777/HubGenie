import { Command } from "@cliffy/command";
import { META } from "./meta.ts";
import { commitAction } from "./actions/commit.ts";

if (import.meta.main) {
  await new Command()
    .name(META.name)
    .description(META.description)
    .version(META.version)
    .command("commit", "Generate some commit messages")
    .action(commitAction)
    .parse(Deno.args);
}
