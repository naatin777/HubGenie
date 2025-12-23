import { Box, render, Text, useApp } from "ink";
import { useEffect } from "react";

interface VersionProps {
  name: string;
  version: string;
}

export const Version: React.FC<VersionProps> = ({ name, version }) => {
  const { exit } = useApp();

  useEffect(() => {
    exit();
  }, [exit]);

  return (
    <Box>
      <Text>{name} version {version}</Text>
    </Box>
  );
};

// deno-coverage-ignore-start
if (import.meta.main) {
  render(<Version name="my-cli" version="1.5.4" />);
}
// deno-coverage-ignore-stop
