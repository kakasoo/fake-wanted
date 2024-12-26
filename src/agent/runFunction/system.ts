import { readFileSync } from "fs";
import { ChatCompletionSystemMessageParam } from "openai/resources";
import { join } from "path";

export namespace System {
  export function getSchemaInfo(): string {
    const filepath = join(__dirname, "../../../packages/api/openai-positional.json");
    const schema = readFileSync(filepath, { encoding: "utf-8" });
    return schema;
  }

  export function prompt() {
    return {
      role: "system",
      content: [].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
