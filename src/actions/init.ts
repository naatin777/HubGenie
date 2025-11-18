import { saveConfig } from "../utils/config.ts";
import { initEditor, initLanguage, selectScope } from "../utils/selection.ts";

export async function initAction(
  options: { global?: true | undefined },
): Promise<void> {
  const scope = await selectScope(options);
  const language = await initLanguage();
  const editor = initEditor();
  await saveConfig({
    language: language,
    editor: editor,
  }, scope);
}
