import {
  initLanguage,
  initModel,
  initTemperature,
  selectScope,
} from "../utils/selection.ts";
import {
  getAllGlobalConfig,
  getAllLocalConfig,
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
  if (scope === "local") {
    const localConfig = await getAllLocalConfig();
    localConfig.language = language;
    await saveConfig(localConfig, scope);
  } else {
    const globalConfig = await getAllGlobalConfig();
    globalConfig.language = language;
    await saveConfig(globalConfig, scope);
  }
}

export async function configTemperatureAction(
  options: {
    local?: true | undefined;
    global?: true | undefined;
  },
): Promise<void> {
  const scope = await selectScope(options);
  const temperature = await initTemperature();
  if (scope === "local") {
    const localConfig = await getAllLocalConfig();
    localConfig.temperature = temperature;
    await saveConfig(localConfig, scope);
  } else {
    const globalConfig = await getAllGlobalConfig();
    globalConfig.temperature = temperature;
    await saveConfig(globalConfig, scope);
  }
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
  if (scope === "local") {
    const localConfig = await getAllLocalConfig();
    localConfig.model = model;
    await saveConfig(localConfig, scope);
  } else {
    const globalConfig = await getAllGlobalConfig();
    globalConfig.model = model;
    await saveConfig(globalConfig, scope);
  }
}
