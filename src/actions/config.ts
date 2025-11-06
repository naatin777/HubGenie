import {
  initLanguage,
  initModel,
  initTemperature,
  selectScope,
} from "../utils/selection.ts";
import { getApiKey, getConfig } from "../utils/config.ts";

export async function configLanguageAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const language = await initLanguage();
  const scope = await selectScope(options);
  console.log(`Configured language to ${language} for ${scope}`);
}

export async function configTemperatureAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const temperature = await initTemperature();
  const scope = await selectScope(options);
  console.log(`Configured temperature to ${temperature} for ${scope}`);
}

export async function configModelAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const baseURL = await getConfig("baseURL") as string;
  const apiKey = await getApiKey();
  const model = await initModel(baseURL, apiKey);
  const scope = await selectScope(options);
  console.log(`Configured model to ${model} for ${scope}`);
}
