import type z from "zod";
import type { IssueSchema } from "../../schema.ts";
import type { Issue, IssueTemplate } from "../../type.ts";

export type IssueState =
  | {
    step: "loading_templates";
  }
  | {
    step: "select_template";
    templates: IssueTemplate[];
  }
  | {
    step: "input_overview";
    template: IssueTemplate;
  }
  | {
    step: "generating";
    template: IssueTemplate;
    overview: string;
  }
  | {
    step: "select_issue";
    issues: z.infer<typeof IssueSchema>;
  }
  | {
    step: "edit_issue";
    selectedIssue: Issue;
  }
  | {
    step: "creating";
    finalIssue: Issue;
  }
  | {
    step: "done";
    url: string;
  }
  | {
    step: "error";
  };

export type IssueAction =
  | {
    type: "LOAD_TEMPLATES";
    templates: IssueTemplate[];
  }
  | {
    type: "SELECT_TEMPLATE";
    template: IssueTemplate;
  }
  | {
    type: "SUBMIT_OVERVIEW";
    overview: string;
  }
  | {
    type: "GENERATED";
    issues: z.infer<typeof IssueSchema>;
  }
  | {
    type: "SELECT_ISSUE";
    issue: Issue;
  }
  | {
    type: "EDIT_DONE";
    finalIssue: Issue;
  }
  | {
    type: "CREATED";
    url: string;
  }
  | {
    type: "ERROR";
  };

export function issueReducer(
  state: IssueState,
  action: IssueAction,
): IssueState {
  switch (action.type) {
    case "LOAD_TEMPLATES":
      return { step: "select_template", templates: action.templates };
    case "SELECT_TEMPLATE":
      return { step: "input_overview", template: action.template };
    case "SUBMIT_OVERVIEW":
      if (state.step !== "input_overview") return state;
      return {
        step: "generating",
        template: state.template,
        overview: action.overview,
      };
    case "GENERATED":
      return { step: "select_issue", issues: action.issues };
    case "SELECT_ISSUE":
      return { step: "edit_issue", selectedIssue: action.issue };
    case "EDIT_DONE":
      return { step: "creating", finalIssue: action.finalIssue };
    case "CREATED":
      return { step: "done", url: action.url };
    case "ERROR":
      return { step: "error" };
    default:
      return state;
  }
}
