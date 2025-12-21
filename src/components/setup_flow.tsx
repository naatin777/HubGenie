import { Box, render, useApp } from "ink";
import { useState } from "react";
import {
  EditorSelector,
  LanguageSelector,
  OverviewInput,
} from "./selection.tsx";
import { saveConfig } from "../services/config.ts";
import type { Config, ScopeFlag } from "../type.ts";

export type SetupStep = "language" | "editor" | "overview" | "done";

export function SetupFlow(
  { scope, onDone }: { scope: ScopeFlag; onDone?: (config: Config) => void },
) {
  const [step, setStep] = useState<SetupStep>("language");
  const [config, setConfig] = useState({
    language: "",
    editor: "",
    overview: "",
  });
  const { exit } = useApp();

  const handleLanguage = (language: string) => {
    setConfig((prev) => ({ ...prev, language }));
    setStep("editor");
  };

  const handleEditor = (editor: string) => {
    setConfig((prev) => ({ ...prev, editor }));
    setStep("overview");
  };

  const handleOverview = async (overview: string) => {
    const finalConfig = { ...config, overview };
    setConfig(finalConfig);
    await saveConfig(finalConfig, scope);
    setStep("done");
    if (onDone) onDone(finalConfig);
    exit();
  };

  return (
    <Box flexDirection="column">
      {step === "language" && <LanguageSelector onSelect={handleLanguage} />}
      {step === "editor" && <EditorSelector onSelect={handleEditor} />}
      {step === "overview" && <OverviewInput onSubmit={handleOverview} />}
    </Box>
  );
}

if (import.meta.main) {
  render(<SetupFlow scope={{ local: true }} />);
}
