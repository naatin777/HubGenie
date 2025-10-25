import { Command } from "@cliffy/command";
import { META } from "./meta.ts";

if (import.meta.main) {
  await new Command()
    .name(META.name)
    .description(META.description)
    .version(META.version)
    .parse(Deno.args);
}
