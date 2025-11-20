import { ScopeFlag } from "../type.ts";
import { saveConfig } from "../utils/config.ts";
import { initEditor, initLanguage } from "../utils/selection.ts";

export async function initAction(
  options: ScopeFlag,
): Promise<void> {
  const language = await initLanguage();
  const editor = initEditor();
  await saveConfig({
    language: language,
    editor: editor,
  }, options);
}
