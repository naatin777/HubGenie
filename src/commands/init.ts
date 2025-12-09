import { parseArgs } from "@std/cli";
import { BaseCommand, type Command } from "../lib/command.ts";
import { saveConfig } from "../utils/config.ts";
import {
  inputOverview,
  selectEditor,
  selectLanguage,
} from "../utils/selection.ts";
import { getConfig } from "../utils/config.ts";

interface InitCommandOption {
  help: boolean;
  local: boolean;
  global: boolean;
  [key: string]: unknown;
}

export class InitCommand extends BaseCommand {
  name: string = "init";
  description: string = "Initialize a new project";
  commands: Command[] = [];
  async execute(
    args: (string | number)[],
    options: InitCommandOption,
  ): Promise<void> {
    console.log(args);
    console.log(options);

    const parsed = parseArgs(args.map((arg) => arg.toString()), {
      boolean: ["local", "global", "help"],
    });

    const config = await getConfig(parsed);
    if (config) {
      console.error("Config already exists");
      return;
    }
    const language = await selectLanguage();
    const editor = selectEditor();
    const overview = inputOverview();
    await saveConfig({
      language: language,
      editor: editor,
      overview: overview,
    }, parsed);
  }
}
