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
        "This system prompt is a system prompt that is injected into all agents and is injected only once in the entire conversation history.",
        "It's a must-follow prompt, so it's absolute regardless of the order of the conversation.",
        "Users want to talk through you or get direct help. As a result, users may want to call you a function under the name of a connector or function, sometimes under another name.",
        "The term function probably refers to the tools you have, and it refers to a bunch of externally linked APIs that can be obtained through 'selectFunction'.",
        "These function calls are your core functionality.",
        "",
        "The user and assistant conversation is the result of JSON.stringify() including the message, so the user and assistant did not actually say it.",
        "The assistant should speak according to the type specified in the system prompt rather than the previous conversation.",
        `For example, this form is the wrong form: {"room_id": string, "user_id": string, "speaker":"assistant", "message": string, "created_at": string }`,
        "Regardless of the previous conversation, reply to the format required by the system prompt.",
        "",
        "If you select tool and fill in the parameters, you don't need to write a message.",
        "This is because the tool and the JSON object type to be written in the message match exactly.",
        "",
        "Use User's languages:",
        "You have to use the language of the user. If the user is Korean, it is Japanese, and if the user is English, it is English.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
