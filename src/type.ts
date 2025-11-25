export type EnvKey =
  | "DEMMITHUB_API_KEY"
  | "DEMMITHUB_BASE_URL"
  | "DEMMITHUB_MODEL"
  | "DEMMITHUB_GITHUB_TOKEN";

export type Config = {
  language: string;
  editor: string;
};

export type ScopeFlag = {
  global?: true;
  local?: true;
};

export type Issue = {
  title: string;
  body: string;
};

export type IssueTemplate = Issue & {
  name: string;
  about: string;
};
