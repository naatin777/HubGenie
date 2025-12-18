import { useEffect, useReducer } from "react";
import { commitReducer, type CommitState } from "./reducer.ts";
import { GitService } from "../../services/git/git_service.ts";
import { generateStructuredOutput } from "../../utils/openai.ts";
import { COMMIT_SYSTEM_MESSAGE } from "../../constants/message.ts";
import { CommitSchema } from "../../schema.ts";
import { editText } from "../../utils/edit.ts";
import { useApp } from "ink";

const initialState: CommitState = { step: "loading" };

export function useCommitFlow() {
  const [state, dispatch] = useReducer(commitReducer, initialState);
  const { exit } = useApp();

  const generateCommitMessages = async () => {
    const gitService = new GitService();
    const diff = await gitService.diff.getGitDiffStaged();
    if (!diff) {
      dispatch({ type: "ERROR" });
      return;
    }
    const result = await generateStructuredOutput(
      [
        {
          role: "system",
          content: COMMIT_SYSTEM_MESSAGE,
        },
        {
          role: "user",
          content: diff,
        },
      ],
      CommitSchema,
      "commit messages",
    );
    if (!result) {
      dispatch({ type: "ERROR" });
      return;
    }
    dispatch({ type: "SELECT", messages: result });
  };

  const selectCommitMessage = (
    messages: {
      header: string;
      body: string | null;
      footer: string | null;
    } | undefined,
  ) => {
    if (!messages) {
      dispatch({ type: "ERROR" });
      return;
    }
    dispatch({ type: "EDIT", selectedMessage: messages });
  };

  const editCommitMessage = async () => {
    if (state.step !== "edit") {
      dispatch({ type: "ERROR" });
      return;
    }
    const combinedCommitMessage = [
      state.selectedMessage.header,
      state.selectedMessage.body,
      state.selectedMessage.footer,
    ]
      .filter(Boolean).join("\n\n");
    const editedCombinedCommitMessage = await editText(combinedCommitMessage);
    if (editedCombinedCommitMessage.trim()) {
      dispatch({ type: "COMMIT", commitMessage: editedCombinedCommitMessage });
    } else {
      dispatch({ type: "ERROR" });
    }
  };

  const commitMessage = async () => {
    if (state.step !== "commit") {
      dispatch({ type: "ERROR" });
      return;
    }
    const gitService = new GitService();
    await gitService.commit.commitWithMessages([
      state.commitMessage,
    ]);
    dispatch({ type: "DONE" });
  };

  useEffect(() => {
    if (state.step === "done" || state.step === "error") {
      exit();
    }
  }, [state.step]);

  return {
    state,
    generateCommitMessages,
    selectCommitMessage,
    editCommitMessage,
    commitMessage,
  };
}
