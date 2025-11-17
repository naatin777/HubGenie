import yargs, { type ArgumentsCamelCase, type Argv } from "yargs";
import { META } from "./meta.ts";
import { commitAction } from "./actions/commit.ts";
import { initAction } from "./actions/init.ts";
import { issueAction } from "./actions/issue.ts";
import { configEditorAction, configLanguageAction } from "./actions/config.ts";

if (import.meta.main) {
  await yargs(Deno.args)
    .scriptName(META.name)
    .version(META.version)
    .usage(META.description)
    .option("local", {
      type: "boolean",
      description: "Use local project config",
      global: true,
    })
    .option("global", {
      type: "boolean",
      description: "Use global user config",
      global: true,
    })
    .command(
      "init",
      "Initialize configuration",
      () => {},
      async (
        argv: ArgumentsCamelCase<{ local?: boolean; global?: boolean }>,
      ) => {
        await initAction({ local: argv.local, global: argv.global });
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
              argv: ArgumentsCamelCase<{ local?: boolean; global?: boolean }>,
            ) => {
              await configLanguageAction({
                local: argv.local,
                global: argv.global,
              });
            },
          )
          .command(
            "editor",
            "Manage editor",
            async (
              argv: ArgumentsCamelCase<{ local?: boolean; global?: boolean }>,
            ) => {
              await configEditorAction({
                local: argv.local,
                global: argv.global,
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
