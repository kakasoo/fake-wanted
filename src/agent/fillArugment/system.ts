import { ChatCompletionMessageParam, ChatCompletionSystemMessageParam } from "openai/resources";

import { System as SelectFunctionSystem } from "../selectFunction/system";

export namespace System {
  export function prompt(
    selectedFunctionHistories: (Omit<ChatCompletionMessageParam, "content"> & { content: string })[],
  ) {
    const contents = selectedFunctionHistories.map((el) => JSON.parse(el.content));

    return {
      role: "system",
      content: [
        "This is a system prompt that is injected only into the 'FillArgumentAgent' and is injected only once in the entire conversation history.",
        "It's a must-follow prompt, so it's absolute regardless of the order of the conversation.",
        "",
        "<FUNCTIONS>",
        contents.length ? JSON.stringify(contents) : SelectFunctionSystem.getSchemaInfo(), // 이전에 SELECT한 함수가 없는 경우, 전체 스키마를 봐야 한다.
        "</FUNCTIONS>",
        "",
        "You have to give a FillArgument-type response.",
        `Your response format is always: "{ "type": "fillArgument", "method": "get" | "post" | "delete" | "put" | "patch", "pathname": string, "parameters": JSON, "message": string }"`,
        "'fillArgument'\'s 'parameters' is JSON, and each JSON object should be mapped under the names 'query', 'body', and 'param'.",
        'for example, { "parameters": { "body": { "query": "EXAMPLE_TEXT" } } }',
        "Be careful that neither query, body, or parameter is a string or a number.",
        'This type of response is shown directly to the user, but Only "message" property.',
        "'message' properties mean asking the user one last time if they can fill in these functional factors and call them.",
        "Because users can only see 'message' properties, the 'message' must be fully described for the parameter values.",
        "If the user approves it, it will actually run in 'runFunction'.",
      ].join("\n"),
    } satisfies ChatCompletionSystemMessageParam;
  }
}
