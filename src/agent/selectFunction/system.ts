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
        "There are a lot of lists of functions, but you have to answer in user's language no matter what language the list of functions is written in.",
        "",
        "<FUNCTIONS>",
        System.getSchemaInfo(),
        "</FUNCTIONS>",
        "",
        "You have to give a SelectFunction-type response.",
        `Your response format is always: "{ "type": "selectFunction", "functions": Array<{ method: "get" | "post" | "delete" | "put" | "patch", "pathname": string, "parameters": JSON }>, "message": string, "isSafeMethod": boolean }"`,
        "'selectFunction'\'s 'parameters' is JSON, and each JSON object should be mapped under the names 'query', 'body', and 'param'.",
        "The parameter information of the selectFunction does not exist to fill the value, but writes down a description of each property in advance in case of calling this function later.",
        'This type of response is shown directly to the user, but Only "message" property.',
        "If you have found a function, you must write a full description of the function in the message.",
        "The user will look at the description of the function and ask the assistant for help.",
        "Conversely, if you have the necessary parameters to run the function, you can use Message Properties to ask the user questions.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
