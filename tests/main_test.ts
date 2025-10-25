import { assertEquals } from "@std/assert";
import { add } from "../src/hubgenie.ts";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});
