import { Box, Text, useApp } from "ink";
import type { Command, FlagType, OptionType } from "../../lib/command.ts";
import { useEffect } from "react";

interface HelpProps<
  F extends FlagType,
  O extends OptionType,
> {
  name: string;
  description: string;
  consumedArgs: string[];
  flags: F;
  options: O;
  commands: Command[];
  error: string | undefined;
}

export function Help<F extends FlagType, O extends OptionType>(
  {
    name,
    description,
    consumedArgs,
    flags,
    options,
    commands,
    error,
  }: HelpProps<F, O>,
) {
  const hasCommands = commands.length > 0;
  const hasOptions = Object.keys(options).length > 0;
  const hasFlags = Object.keys(flags).length > 0;

  const { exit } = useApp();

  useEffect(() => {
    exit();
  }, [exit]);

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="column">
        {error && <Text color="red">{error}</Text>}
      </Box>
      <Box flexDirection="column">
        <Text color="blue">Name:</Text>
        <Box paddingLeft={4}>
          <Text>{`${name} - ${description}`}</Text>
        </Box>
      </Box>
      <Box flexDirection="column">
        <Text color="blue">Usage:</Text>
        <Box paddingLeft={4}>
          <Text>
            {consumedArgs.join(" ")}
            <Text color="green">
              {hasCommands ? " [command]" : ""}
            </Text>
            <Text color="yellow">
              {hasOptions || hasFlags ? " [options]" : ""}
            </Text>
          </Text>
        </Box>
      </Box>
      {hasCommands && (
        <Box flexDirection="column">
          <Text color="blue">Commands:</Text>
          <Box flexDirection="column" paddingLeft={4}>
            {commands.map((command, index) => (
              <Box key={index} flexDirection="row">
                <Box width={12}>
                  <Text color="green">{command.name}</Text>
                </Box>
                <Text>{command.description}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      {(hasFlags || hasOptions) && (
        <Box flexDirection="column">
          <Text color="blue">Options:</Text>
          <Box flexDirection="column" paddingLeft={4}>
            {Object.keys({ ...options, ...flags }).map((key) => {
              return (
                <Box key={key} flexDirection="row">
                  <Box width={18}>
                    <Text color="yellow">
                      --{key}
                      {flags[key].alias ? `, -${flags[key].alias}` : ""}
                    </Text>
                  </Box>
                  <Text>{flags[key].description}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
