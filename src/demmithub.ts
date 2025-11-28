import yargs, { type ArgumentsCamelCase, type Argv } from "yargs";
import { commitAction } from "./actions/commit.ts";
import { initAction } from "./actions/init.ts";
import { issueAction } from "./actions/issue.ts";
import {
  configEditorAction,
  configLanguageAction,
  configOverviewAction,
} from "./actions/config.ts";
import type { ScopeFlag } from "./type.ts";
import DemmitHub from "../deno.json" with { type: "json" };

if (import.meta.main) {
  await yargs(Deno.args)
    .scriptName(DemmitHub.name)
    .version(DemmitHub.version)
    .usage(DemmitHub.description)
    .option("global", {
      type: "boolean",
      description: "Use global user config",
      global: true,
    })
    .option("local", {
      type: "boolean",
      description: "Use local personal configuration (git-ignored)",
      global: true,
    })
    .command(
      "init",
      "Initialize configuration",
      () => {},
      async (
        argv: ArgumentsCamelCase<ScopeFlag>,
      ) => {
        await initAction({ global: argv.global, local: argv.local });
      },
    )
    .command(
      "config <subcommand>",
      "Manage configuration",
      (yargs: Argv) => {
        return yargs
          .command(
            "language",
            "Manage language",
            async (
              argv: ArgumentsCamelCase<ScopeFlag>,
            ) => {
              await configLanguageAction({
                global: argv.global,
                local: argv.local,
              });
            },
          )
          .command(
            "editor",
            "Manage editor",
            async (
              argv: ArgumentsCamelCase<ScopeFlag>,
            ) => {
              await configEditorAction({
                global: argv.global,
                local: argv.local,
              });
            },
          )
          .command(
            "overview",
            "Manage overview",
            async (
              argv: ArgumentsCamelCase<ScopeFlag>,
            ) => {
              await configOverviewAction({
                global: argv.global,
                local: argv.local,
              });
            },
          )
          .demandCommand(1, "You need to specify a subcommand");
      },
    )
    .command(
      "commit",
      "Generate some commit messages",
      () => {},
      async () => {
        await commitAction();
      },
    )
    .command(
      "issue",
      "Generate an issue",
      () => {},
      async () => {
        await issueAction();
      },
    )
    .demandCommand(1, "You need to specify a command")
    .help()
    .alias("help", "h")
    .alias("version", "v")
    .strict()
    .parseAsync();
}
