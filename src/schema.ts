import z from "zod";

export const CommitSchema = z.object({
  commit_message: z.array(
    z.object({
      header: z.string(),
      body: z.string().nullable(),
      footer: z.string().nullable(),
    }),
  ),
});

export const IssueSchema = z.object({
  issue: z.array(
    z.object({
      title: z.string(),
      body: z.string(),
    }),
  ),
});

export const createAgentSchema = <T extends z.ZodTypeAny>(item: T) => {
  return z.object({
    agent: z.discriminatedUnion("status", [
      z.object({
        status: z.literal("question"),
        questions: z.array(z.string()),
      }),
      z.object({
        status: z.literal("final_answer"),
        item: item,
      }),
    ]),
  });
};

export const IssueAgentSchema = createAgentSchema(IssueSchema);
