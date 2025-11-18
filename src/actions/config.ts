import { initEditor, initLanguage, selectScope } from "../utils/selection.ts";
import { getAllConfig, saveConfig } from "../utils/config.ts";

export async function configLanguageAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const scope = selectScope(options);
  const language = await initLanguage();
  const localConfig = await getAllConfig(scope);
  localConfig.language = language;
  await saveConfig(localConfig, scope);
}

export async function configEditorAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const scope = selectScope(options);
  const editor = initEditor();
  const localConfig = await getAllConfig(scope);
  localConfig.editor = editor;
  await saveConfig(localConfig, scope);
}
