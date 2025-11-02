export interface GhRunner {
    run(args: string[]): Promise<string>;
}

export class DefaultGhRunner implements GhRunner {
    async run(args: string[]): Promise<string> {
        const cmd = new Deno.Command("gh", {
            args,
            stdout: "piped",
        });
        const output = await cmd.output();
        return new TextDecoder().decode(output.stdout);
    }
}

export async function createIssue(
    runner: GhRunner = new DefaultGhRunner(),
    title: string,
    body: string,
): Promise<string> {
    return await runner.run([
        "issue",
        "create",
        "-t",
        title,
        "-b",
        body,
    ]);
}
