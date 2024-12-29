import { ChatCompletionTool } from "openai/resources";
import typia from "typia";

export namespace MessageType {
  export interface Tool {
    call(input: MessageType): never;
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

export interface MessageType {
  type: "fillArgument";
  method: "get" | "post" | "delete" | "put" | "patch";
  pathname: string;
  parameters: {
    query?: object;
    body?: object;
    param?: object;
  };
  message: string;
}
