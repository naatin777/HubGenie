import { load } from "@std/dotenv";
import { EnvKey } from "../type.ts";

export async function getEnv(key: EnvKey): Promise<string> {
  await load({ export: true });

  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not set`);
  return value;
}
