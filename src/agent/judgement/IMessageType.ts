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

  export type Transition<T extends MessageType["type"]> = T extends "chat"
    ? "chat" | "selectFunction" | "fillArgument" | "runFunction"
    : T extends "selectFunction"
      ? "chat" | "fillArgument" | "runFunction"
      : T extends "fillArgument"
        ? "chat" | "runFunction"
        : "chat";

  export namespace Functions {
    export const chat = typia.llm
      .application<
        {
          /**
           * type property is Function that pulls out the type that can be called the next time.
           * and, reason is the reason why he chose this type.
           *
           * @title call
           */
          call(input: { type: Transition<"chat">; reason: string }): never;
        },
        "chatgpt"
      >()
      .functions.map((func): ChatCompletionTool => {
        return {
          type: "function",
          function: {
            name: func.name,
            description: func.description,
            parameters: func.parameters as Record<string, any>,
          },
        };
      });

    export const selectFunction = typia.llm
      .application<
        {
          /**
           * type property is Function that pulls out the type that can be called the next time.
           * and, reason is the reason why he chose this type.
           *
           * @title call
           */
          call(input: { type: Transition<"selectFunction">; reason: string }): never;
        },
        "chatgpt"
      >()
      .functions.map((func): ChatCompletionTool => {
        return {
          type: "function",
          function: {
            name: func.name,
            description: func.description,
            parameters: func.parameters as Record<string, any>,
          },
        };
      });

    export const fillArgument = typia.llm
      .application<
        {
          /**
           * type property is Function that pulls out the type that can be called the next time.
           * and, reason is the reason why he chose this type.
           *
           * @title call
           */
          call(input: { type: Transition<"fillArgument">; reason: string }): never;
        },
        "chatgpt"
      >()
      .functions.map((func): ChatCompletionTool => {
        return {
          type: "function",
          function: {
            name: func.name,
            description: func.description,
            parameters: func.parameters as Record<string, any>,
          },
        };
      });

    export const runFunction = typia.llm
      .application<
        {
          /**
           * type property is Function that pulls out the type that can be called the next time.
           * and, reason is the reason why he chose this type.
           *
           * @title call
           */
          call(input: { type: Transition<"runFunction">; reason: string }): never;
        },
        "chatgpt"
      >()
      .functions.map((func): ChatCompletionTool => {
        return {
          type: "function",
          function: {
            name: func.name,
            description: func.description,
            parameters: func.parameters as Record<string, any>,
          },
        };
      });

    export const called = MessageType.Functions.runFunction;
  }
}

export interface MessageType {
  // NEVER CHANGE TITLE OF THIS JSDOC.
  /**
   * @title type
   */
  type: "chat" | "selectFunction" | "fillArgument" | "runFunction";

  /**
   * @title reason is the reason why he chose this type.
   */
  reason: string;
}
