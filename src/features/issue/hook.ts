import { useEffect, useReducer } from "react";
import { issueReducer, type IssueState } from "./reducer.ts";
import { getIssueTemplatePath } from "../../utils/path.ts";
import {
  parseMarkdownIssueTemplate,
  stringifyMarkdownIssue,
} from "../../utils/parser.ts";

import { editText } from "../../utils/edit.ts";
import type { IssueSchema } from "../../schema.ts";
import type z from "zod";
import { createIssue as createIssueService } from "../../services/github/issue.ts";
import { useApp } from "ink";
import type { Issue, IssueTemplate } from "../../type.ts";

const initialState: IssueState = { step: "loading_templates" };

export function useIssueFlow() {
  const [state, dispatch] = useReducer(issueReducer, initialState);
  const { exit } = useApp();

  const loadTemplates = async () => {
    try {
      const issueTemplatePath = await getIssueTemplatePath();
      const issueTemplates = issueTemplatePath.markdown.map((markdownPath) =>
        parseMarkdownIssueTemplate(new TextDecoder().decode(
          Deno.readFileSync(markdownPath),
        ))
      );
      if (issueTemplates.length === 0) {
        dispatch({ type: "ERROR" });
        return;
      }
      dispatch({ type: "LOAD_TEMPLATES", templates: issueTemplates });
    } catch (e) {
      console.error(e);
      dispatch({ type: "ERROR" });
    }
  };

  const selectTemplate = (template: IssueTemplate | undefined) => {
    if (!template) {
      dispatch({ type: "ERROR" });
      return;
    }
    dispatch({ type: "SELECT_TEMPLATE", template });
  };

  const submitOverview = (overview: string) => {
    dispatch({ type: "SUBMIT_OVERVIEW", overview });
  };

  const handleAgentDone = (result: z.infer<typeof IssueSchema>) => {
    if (!result || result.issue.length === 0) {
      dispatch({ type: "ERROR" });
      return;
    }
    dispatch({ type: "GENERATED", issues: result });
  };

  const selectIssue = (issue: Issue | undefined) => {
    if (!issue) {
      dispatch({ type: "ERROR" });
      return;
    }
    dispatch({ type: "SELECT_ISSUE", issue });
  };

  const editIssue = async () => {
    if (state.step !== "edit_issue") {
      return;
    }
    try {
      const markdown = stringifyMarkdownIssue(state.selectedIssue);
      const editedMarkdown = await editText(markdown);
      const editedIssueTemplate = parseMarkdownIssueTemplate(editedMarkdown);

      // parseMarkdownIssueTemplate returns IssueTemplate, but we just need Issue (title, body)
      const editedIssue: Issue = {
        title: editedIssueTemplate.title,
        body: editedIssueTemplate.body,
      };

      dispatch({ type: "EDIT_DONE", finalIssue: editedIssue });
    } catch (e) {
      console.error(e);
      dispatch({ type: "ERROR" });
    }
  };

  const createIssue = async () => {
    if (state.step !== "creating") {
      return;
    }
    try {
      const response = await createIssueService(
        state.finalIssue.title,
        state.finalIssue.body,
      );
      dispatch({ type: "CREATED", url: response.url });
    } catch (e) {
      console.error(e);
      dispatch({ type: "ERROR" });
    }
  };

  useEffect(() => {
    if (state.step === "done" || state.step === "error") {
      exit();
    }
  }, [state.step]);

  return {
    state,
    loadTemplates,
    selectTemplate,
    submitOverview,
    handleAgentDone,
    selectIssue,
    editIssue,
    createIssue,
  };
}
