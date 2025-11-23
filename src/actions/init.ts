import type { ScopeFlag } from "../type.ts";
import { saveConfig } from "../utils/config.ts";
import { initEditor, initLanguage } from "../utils/selection.ts";
import { getConfig } from "../utils/config.ts";

export async function initAction(
  options: ScopeFlag,
): Promise<void> {
  const config = await getConfig(options);
  if (config) {
    console.error("Config already exists");
    Deno.exit(1);
  }
  const language = await initLanguage();
  const editor = initEditor();
  await saveConfig({
    language: language,
    editor: editor,
  }, options);
}
