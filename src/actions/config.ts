import { initLanguage, initModel, selectScope } from "../utils/selection.ts";
import {
  getAllConfig,
  getApiKey,
  getConfig,
  saveConfig,
} from "../utils/config.ts";

export async function configLanguageAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const scope = await selectScope(options);
  const language = await initLanguage();
  const localConfig = await getAllConfig(scope);
  localConfig.language = language;
  await saveConfig(localConfig, scope);
}

export async function configModelAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const baseURL = await getConfig("baseURL") as string;
  const apiKey = await getApiKey();
  const scope = await selectScope(options);
  const model = await initModel(baseURL, apiKey);
  const localConfig = await getAllConfig(scope);
  localConfig.model = model;
  await saveConfig(localConfig, scope);
}
