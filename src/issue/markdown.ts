import type { IssueTemplate } from "../type.ts";
import { extract } from "@std/front-matter/yaml";

export function parseMarkdownIssueTemplate(
  markdown: string,
): IssueTemplate {
  const { attrs, body } = extract<IssueTemplate>(markdown);
  return {
    title: attrs.title,
    body: body.trim(),
    name: attrs.name,
    about: attrs.about,
  };
}
