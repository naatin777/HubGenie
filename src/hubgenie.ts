import { Command } from "@cliffy/command";

if (import.meta.main) {
  await new Command()
    .name("hubgenie")
    .description("AI-powered CLI for generating smart commit messages, pull requests, and issues.")
    .parse(Deno.args);
}
