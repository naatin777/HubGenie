export type EnvKey =
  | "DEMMITHUB_API_KEY"
  | "DEMMITHUB_BASE_URL"
  | "DEMMITHUB_MODEL";

export type Config = {
  language: string;
  editor: string;
};

export type ScopeFlag = {
  global?: true;
  local?: true;
};
