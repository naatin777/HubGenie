import { Box, render, Text, useApp } from "ink";
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
      {error &&
        (
          <Box flexDirection="column">
            <Text color="red">{error}</Text>
          </Box>
        )}
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
            {Object.keys(flags).map((key) => {
              const alias = flags[key]?.alias ?? "";
              const description = flags[key]?.description ?? "";
              return (
                <Box key={key} flexDirection="row">
                  <Box width={32}>
                    <Text color="yellow">
                      --{key}
                      {alias ? `, -${alias}` : ""}
                    </Text>
                  </Box>
                  <Text>{description}</Text>
                </Box>
              );
            })}
            {Object.keys(options).map((key) => {
              const alias = options[key]?.alias ?? "";
              const description = options[key]?.description ?? "";
              return (
                <Box key={key} flexDirection="row">
                  <Box width={32}>
                    <Text color="yellow">
                      {`--${key}=\<value\>`}
                      {alias ? `, -${alias}=\<value\>` : ""}
                    </Text>
                  </Box>
                  <Text>{description}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* coverage-ignore-start */
if (import.meta.main) {
  render(
    <Help
      name="my-cli"
      description="My CLI"
      consumedArgs={["my-cli"]}
      commands={[{
        name: "Command",
        description: "Command description",
        commands: [],
        defaultFlags: {},
        defaultOptions: {},
        execute: async (
          _remainingArgs: string[],
          _consumedArgs: string[],
          _flags: FlagType,
          _options: OptionType,
        ): Promise<void> => {},
      }]}
      flags={{
        flags: {
          value: false,
          description: "Flags",
          alias: "f",
        },
      }}
      options={{
        options: {
          value: "abc",
          description: "Options",
          alias: "o",
        },
      }}
      error={undefined}
    />,
  );
}
/* coverage-ignore-end */
