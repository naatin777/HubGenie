import type { ScopeFlag } from "../type.ts";
import { saveConfig } from "../utils/config.ts";
import {
  inputOverview,
  selectEditor,
  selectLanguage,
} from "../utils/selection.ts";
import { getConfig } from "../utils/config.ts";

export async function initAction(
  options: ScopeFlag,
): Promise<void> {
  const config = await getConfig(options);
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
  }, options);
}
