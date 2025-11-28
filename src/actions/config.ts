import {
  inputOverview,
  selectEditor,
  selectLanguage,
} from "../utils/selection.ts";
import { getMergedConfig, saveConfig } from "../utils/config.ts";
import type { ScopeFlag } from "../type.ts";

export async function configLanguageAction(
  options: ScopeFlag,
): Promise<void> {
  const language = await selectLanguage();
  const localConfig = await getMergedConfig();
  localConfig.language = language;
  await saveConfig(localConfig, options);
}

export async function configEditorAction(
  options: ScopeFlag,
): Promise<void> {
  const editor = selectEditor();
  const localConfig = await getMergedConfig();
  localConfig.editor = editor;
  await saveConfig(localConfig, options);
}

export async function configOverviewAction(
  options: ScopeFlag,
): Promise<void> {
  const overview = inputOverview();
  const localConfig = await getMergedConfig();
  localConfig.overview = overview;
  await saveConfig(localConfig, options);
}
