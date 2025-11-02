function parseIssue(content: string): { title: string; body: string } {
  const lines = content.trim().split("\n");
  const title = lines[0].trim();
  const body = lines.slice(1).join("\n").trim();
  return { title, body };
}
