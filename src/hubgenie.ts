import { Command } from "@cliffy/command";
import { META } from "./meta.ts";
import { commitAction } from "./actions/commit.ts";
import { initAction } from "./actions/init.ts";
import { issueAction } from "./actions/issue.ts";
import {
  configEditorAction,
  configLanguageAction,
  configModelAction,
} from "./actions/config.ts";

if (import.meta.main) {
  await new Command()
    .name(META.name)
    .description(META.description)
    .version(META.version)
    .action(function (this: Command) {
      this.showHelp();
    })
    .command(
      "init",
      new Command()
        .description("Initialize configuration")
        .option("--local", "Create local project config")
        .option("--global", "Create global user config")
        .action(initAction),
    )
    .command(
      "config",
      new Command()
        .description("Manage configuration")
        .action(function (this: Command) {
          this.showHelp();
        })
        .command(
          "language",
          new Command()
            .description("Manage language")
            .option("--local", "Edit local project config")
            .option("--global", "Edit global user config")
            .action(configLanguageAction),
        )
        .command(
          "model",
          new Command()
            .description("Manage model")
            .option("--local", "Edit local project config")
            .option("--global", "Edit global user config")
            .action(configModelAction),
        )
        .command(
          "editor",
          new Command()
            .description("Manage editor")
            .option("--local", "Edit local project config")
            .option("--global", "Edit global user config")
            .action(configEditorAction),
        ),
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
