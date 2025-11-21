import { initEditor, initLanguage } from "../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../utils/config.ts";
import type { ScopeFlag } from "../type.ts";

export async function configLanguageAction(
  options: ScopeFlag,
): Promise<void> {
  const language = await initLanguage();
  const localConfig = await getMergedConfig();
  localConfig.language = language;
  await saveConfig(localConfig, options);
}

export async function configEditorAction(
  options: ScopeFlag,
): Promise<void> {
  const editor = initEditor();
  const localConfig = await getMergedConfig();
  localConfig.editor = editor;
  await saveConfig(localConfig, options);
}
