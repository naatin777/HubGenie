export type EnvKey =
  | "DEMMIT_HUB_API_KEY"
  | "DEMMIT_HUB_BASE_URL"
  | "DEMMIT_HUB_MODEL";

export type Config = {
  language: string;
  editor: string;
};

export type ScopeFlag = {
  global?: true;
  local?: true;
};
