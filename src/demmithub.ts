import DemmitHub from "../deno.json" with { type: "json" };
import { CommitCommand } from "./commands/commit.ts";
import { ConfigCommand } from "./commands/config.ts";
import { InitCommand } from "./commands/init.ts";
import { IssueCommand } from "./commands/issue.ts";
import { RootCommand } from "./commands/root.ts";

if (import.meta.main) {
  const app = new RootCommand({
    name: DemmitHub.name,
    description: DemmitHub.description,
    version: DemmitHub.version,
    commands: [
      new InitCommand(),
      new ConfigCommand(),
      new IssueCommand(),
      new CommitCommand(),
    ],
  });

  app.run(Deno.args);
}
