async function editText(text: string): Promise<string> {
  const tempFile = await Deno.makeTempFile({ suffix: ".txt" });

  try {
    await Deno.writeTextFile(tempFile, text);

    const command = new Deno.Command("code", {
      args: ["--wait", tempFile],
      stdin: "inherit",
      stdout: "inherit",
      stderr: "inherit",
    });

    const { code } = await command.output();

    if (code !== 0) {
      throw new Error("Editor was closed without saving");
    }
    const content = await Deno.readTextFile(tempFile);
    return content;
  } finally {
    await Deno.remove(tempFile);
  }
}
