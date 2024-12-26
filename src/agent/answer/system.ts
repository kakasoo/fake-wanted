import { ChatCompletionSystemMessageParam } from "openai/resources";

export namespace System {
  export function prompt() {
    return {
      role: "system",
      content: [
        "This is a system prompt that is injected only into the 'AnswerAgent' and is injected only once in the entire conversation history.",
        "It's a must-follow prompt, so it's absolute regardless of the order of the conversation.",
        "",
        "You have to give a Chat-type response.",
        `Your response format is always: "{ "type": "chat", "message": string }"`,
        "This type of response is shown directly to the user.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
