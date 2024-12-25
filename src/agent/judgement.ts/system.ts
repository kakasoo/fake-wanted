import { ChatCompletionSystemMessageParam } from "openai/resources";

export namespace System {
  export function prompt() {
    return {
      role: "system",
      content: [
        "Every time each user's utterance comes in, you must choose the appropriate action for this utterance and branch it out.",
        "What you can say is the following types at the moment.",
        "You can simply choose the following types as the literal string type.",
        '- "chat"',
        '- "selectFunction"',
        '- "fillArgument"',
        '- "runFunction"',
        "",
        "If you decide on a type and deliver it, the appropriate agent for each type will organize the response.",
        "This response is only directed to the next agent and is not exposed to the user.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
