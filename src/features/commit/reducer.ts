import type z from "zod";
import type { CommitSchema } from "../../schema.ts";

export type CommitState =
  | {
    step: "loading";
  }
  | {
    step: "select";
    messages: z.infer<typeof CommitSchema>;
  }
  | {
    step: "edit";
    selectedMessage: z.infer<typeof CommitSchema>["commit_message"][number];
  }
  | {
    step: "commit";
    commitMessage: string;
  }
  | {
    step: "done";
  }
  | {
    step: "error";
  };

export type CommitAction =
  | {
    type: "SELECT";
    messages: z.infer<typeof CommitSchema>;
  }
  | {
    type: "EDIT";
    selectedMessage: z.infer<typeof CommitSchema>["commit_message"][number];
  }
  | {
    type: "COMMIT";
    commitMessage: string;
  }
  | {
    type: "DONE";
  }
  | {
    type: "ERROR";
  };

export function commitReducer(
  state: CommitState,
  action: CommitAction,
): CommitState {
  switch (action.type) {
    case "SELECT":
      return { step: "select", messages: action.messages };
    case "EDIT":
      return { step: "edit", selectedMessage: action.selectedMessage };
    case "COMMIT":
      return { step: "commit", commitMessage: action.commitMessage };
    case "DONE":
      return { step: "done" };
    case "ERROR":
      return { step: "error" };
    default:
      return state;
  }
}
