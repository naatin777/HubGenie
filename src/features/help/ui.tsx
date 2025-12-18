import { Box, Text, useApp } from "ink";
import type { Command, OptionType } from "../../lib/command.ts";
import { useEffect } from "react";

export function Help<T extends OptionType>(
  { name, description, context, options, commands }: {
    name: string;
    description: string;
    context: (string | number)[];
    options: T;
    commands: Command[];
  },
) {
  const hasCommands = commands.length > 0;
  const hasOptions = Object.keys(options).length > 0;
  const { exit } = useApp();

  useEffect(() => {
    exit();
  }, []);

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column">
        <Text color="blue">Name:</Text>
        <Box paddingLeft={4}>
          <Text>{` ${name} - ${description}`}</Text>
        </Box>
      </Box>
      <Box flexDirection="column">
        <Text color="blue">Usage:</Text>
        <Box paddingLeft={4}>
          <Text>
            {` ${context.join(" ")}`}
            <Text color="green">
              {hasCommands ? " [command]" : ""}
            </Text>
            <Text color="yellow">
              {hasOptions ? " [options]" : ""}
            </Text>
          </Text>
        </Box>
      </Box>
      {hasCommands && (
        <Box flexDirection="column" marginBottom={1}>
          <Text color="blue">Commands:</Text>
          <Box flexDirection="column" paddingLeft={4}>
            {commands.map((command) => (
              <Box key={command.name} flexDirection="row">
                <Box width={12}>
                  <Text color="green">{command.name}</Text>
                </Box>
                <Text>{command.description}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {hasOptions && (
        <Box flexDirection="column">
          <Text color="blue">Options:</Text>
          <Box flexDirection="column" paddingLeft={4}>
            {Object.keys(options).map((key) => {
              return (
                <Box key={key} flexDirection="row">
                  <Box width={18}>
                    <Text color="yellow">
                      {options[key].alias
                        ? `-${options[key].alias}, `
                        : "    "}--{key}
                    </Text>
                  </Box>
                  <Text>{options[key].description}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
