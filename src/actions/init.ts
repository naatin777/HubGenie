import { getApiKey, saveConfig } from "../utils/config.ts";
import {
  initApiKey,
  initBaseURL,
  initLanguage,
  initModel,
  initTemperature,
  selectScope,
} from "../utils/selection.ts";

export async function initAction(
  options: { local?: true | undefined; global?: true | undefined },
): Promise<void> {
  const scope = await selectScope(options);
  const baseURL = await initBaseURL();
  const apiKey = scope === "local" ? await getApiKey() : await initApiKey();
  const model = await initModel(baseURL, apiKey);
  const temperature = await initTemperature();
  const language = await initLanguage();

  if (scope === "local") {
    saveConfig({
      baseURL: baseURL,
      model: model,
      temperature: temperature,
      language: language,
    }, scope);
  } else {
    saveConfig({
      baseURL: baseURL,
      model: model,
      temperature: temperature,
      language: language,
      apiKey: apiKey,
    }, scope);
  }
}
