import { initEditor, initLanguage } from "../utils/selection.ts";
import { getAllConfig, saveConfig } from "../utils/config.ts";

export async function configLanguageAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const language = await initLanguage();
  const localConfig = await getAllConfig(options.global);
  localConfig.language = language;
  await saveConfig(localConfig, options.global);
}

export async function configEditorAction(
  options: {
    global?: true | undefined;
  },
): Promise<void> {
  const editor = initEditor();
  const localConfig = await getAllConfig(options.global);
  localConfig.editor = editor;
  await saveConfig(localConfig, options.global);
}
