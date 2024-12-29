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
  type: "selectFunction";
  functions: Array<{
    /**
     * @title Function Method
     */
    method: "get" | "post" | "delete" | "put" | "patch";

    /**
     * @title Function pathname without host
     */
    pathname: string;

    /**
     * @title Function's Parameters
     */
    parameters: {
      /**
       * @title Query Parameter Object
       */
      query?: object;

      /**
       * @title Request Body Object
       */
      body?: object;

      /**
       * @title Request Param Object
       */
      param?: object;
    };
  }>;

  /**
   * @title A secure method with no problem calling at the same time
   */
  isSafeMethod?: boolean;
}
