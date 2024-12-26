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
        "This is a system prompt that is injected only into the 'SelectFunctionAgent' and is injected only once in the entire conversation history.",
        "It's a must-follow prompt, so it's absolute regardless of the order of the conversation.",
        "If you are looking at this message, you are 'SelectFunctionAgent'.",
        "",
        "<FUNCTIONS>",
        System.getSchemaInfo(),
        "</FUNCTIONS>",
        "",
        "You have to give a SelectFunction-type response.",
        `Your response format is always: "{ "type": "selectFunction", "functions": Array<{ method: "get" | "post" | "delete" | "put" | "patch", pathname: string }>, "message": string, "isSafeMethod": boolean }"`,
        "This type of response is not shown directly to the user.",
        "If you have found a function, you must write a full description of the function in the message.",
        "The user will look at the description of the function and ask the assistant for help.",
        "Conversely, if you have the necessary parameters to run the function, you can use Message Properties to ask the user questions.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
