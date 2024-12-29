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
      content: [
        "If the function call is successful by the server,",
        "the context from the user's response to the function call",
        "must be identified and the function call should be explained in detail.",
        `Your response format is always: "{ "type": "runFunction", "method": "get" | "post" | "delete" | "put" | "patch", "pathname": string }"`,
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
