import { initEditor, initLanguage } from "../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../utils/config.ts";

export async function configLanguageAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const language = await initLanguage();
  const localConfig = await getMergedConfig();
  localConfig.language = language;
  await saveConfig(localConfig, options);
}

export async function configEditorAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const editor = initEditor();
  const localConfig = await getMergedConfig();
  localConfig.editor = editor;
  await saveConfig(localConfig, options);
}
