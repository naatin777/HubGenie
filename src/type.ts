import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { AI_PROVIDER_KEY } from "./constants/ai.ts";

export type Config = {
  language: string;
  editor: string;
  overview: string;
  provider: AI_PROVIDER_KEY;
  model: string;
};

export type ScopeFlag = {
  global?: boolean;
  local?: boolean;
};

export type Issue = {
  title: string;
  body: string;
};

export type IssueTemplate = Issue & {
  name: string;
  about: string;
};

export type Choice<T> = {
  value: T;
  name: string;
  description: string;
};

export type IssueCreateResponse =
  RestEndpointMethodTypes["issues"]["create"]["response"];
