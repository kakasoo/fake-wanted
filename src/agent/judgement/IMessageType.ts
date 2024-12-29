import { ChatCompletionTool } from "openai/resources";
import typia from "typia";

export namespace MessageType {
  export interface Tool {
    call(input: { type: "chat" | "selectFunction" | "fillArgument" | "runFunction" }): never;
  }

  export const functions = typia.llm.application<Tool, "chatgpt">().functions.map((func): ChatCompletionTool => {
    return {
      type: "function",
      function: {
        name: func.name,
        description: func.description,
        parameters: func.parameters as Record<string, any>,
      },
    };
  });
}

export type MessageType = {
  type: "chat" | "selectFunction" | "fillArgument" | "runFunction";
};
