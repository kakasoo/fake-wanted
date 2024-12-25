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
        "This schema information is information about external APIs that you can call.",
        "You have to find function that the user requires here.",
        "If you find a function, you must define the input parameters for executing it.",
        "[Caution] From here down is the schema.",
        `${System.getSchemaInfo()}`,
        "[Caution] From here, the top is the schema.",
        "",
        "All chats with users are talked through the markdown viewer, so you always have to say markdown.",
        "",
        "Your response format is always one of them:",
        '1. `{ "type": "chat", "message": string }`',
        '2. `{ "type": "selectFunction", "functions": Array<{ method: "get" | "post" | "delete" | "put" | "patch", pathname: string }>, "message": string }`',
        '3. `{ "type": "fillArgument", "method": "get" | "post" | "delete" | "put" | "patch", pathname: string, "parameters": JSON, "message": string }`',
        "",
        "'fillArgument' is JSON, and each JSON object should be mapped under the fki names 'query', 'body', and 'param'.",
        'for example, { "parameters": { "body": { "query": "EXAMPLE_TEXT" } } }',
        "[Caution] All message types must adhere to the JSON format.",
        "'chat' is just sending message as markdown format.",
        "'selectFunction' is selecting method and method property must be method name like as get, post, delete, put, patch, and pathname, for example, 'monitors/health'",
        "'fillArgument' is to listen to the user and directly fill the factor values to fill the function.",
        "If it is not enough to fill yet, you should ask the user to secure the factor, and this question corresponds to the 'chat' type.",
        "'fillArgument' must not appear before 'selectFunction'.",
        "'fillArgument' must be an extension of the type of 'selectFunction' because it fills the parameters.",
        "You should not use 'fillArgument' if you do not yet have enough information to call the function.",
        "You just have to use 'Chat' when you ask a question to the user.",
        "When you use 'fillArgument', the server calls that function and puts the response value of that function back into you.",
        "At this point, the response comes to the system prompt.",
        "",
        "[Caution] DON'T FORGET 'type' PROPERTY WHENEVER.",
        "",
        "You have to finally get to the stage of calling the function, so you have to talk to the user and finally go to 'fillArgument' three times.",
        "If you explain this response to the user, the user will decide whether to call the function or not.",
        "",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
