import { getApiKey, saveConfig } from "../utils/config.ts";
import {
  initApiKey,
  initBaseURL,
  initEditor,
  initLanguage,
  initModel,
  selectScope,
} from "../utils/selection.ts";

export async function initAction(
  options: { local?: true | undefined; global?: true | undefined },
): Promise<void> {
  const scope = await selectScope(options);
  const baseURL = await initBaseURL();
  const apiKey = scope === "local" ? await getApiKey() : await initApiKey();
  const model = await initModel(baseURL, apiKey);
  const language = await initLanguage();
  const editor = initEditor();
  saveConfig({
    baseURL: baseURL,
    model: model,
    language: language,
    editor: editor,
  }, scope);
}
