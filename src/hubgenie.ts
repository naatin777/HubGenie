import { Command } from "@cliffy/command";
import { META } from "./meta.ts";
import { commitAction } from "./actions/commit.ts";
import { initAction } from "./actions/init.ts";
import { issueAction } from "./actions/issue.ts";

if (import.meta.main) {
  await new Command()
    .name(META.name)
    .description(META.description)
    .version(META.version)
    .command(
      "init",
      new Command()
        .description("Initialize configuration")
        .option("--local", "Create local project config")
        .option("--global", "Create global user config")
        .action(initAction),
    )
    .command(
      "commit",
      new Command()
        .description("Generate some commit messages")
        .action(commitAction),
    )
    .command(
      "issue",
      new Command()
        .description("Generate an issue")
        .action(issueAction),
    )
    .parse(Deno.args);
}
