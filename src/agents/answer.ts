import { readFileSync } from "fs";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { join } from "path";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { IEntity } from "../api/structures/common/IEntity";
import { RoomProvider } from "../providers/room/RoomProvider";

export namespace AnswerAgent {
  function getSchemaInfo(): string {
    const filepath = join(__dirname, "../../packages/api/openai-positional.json");
    const schema = readFileSync(filepath, { encoding: "utf-8" });
    return schema;
  }

  /**
   * HTTP API
   */
  export const send = (user: IEntity) => async (input: IChatting.IChatInput) => {
    const room = await RoomProvider.at(user)({ id: input.roomId });
    const histories = room.chattings;

    return await new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            "This schema information is information about external APIs that you can call.",
            "You have to find function that the user requires here.",
            "If you find a function, you must define the input parameters for executing it.",
            "[Caution] From here down is the schema.",
            `${getSchemaInfo()}`,
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
            "'fillArguments' is to listen to the user and directly fill the factor values to fill the function.",
            "If it is not enough to fill yet, you should ask the user to secure the factor, and this question corresponds to the 'chat' type.",
            "'fillArguments' must not appear before 'selectFunction'.",
            "'fillArguments' must be an extension of the type of 'selectFunction' because it fills the parameters.",
            "",
            "You have to finally get to the stage of calling the function, so you have to talk to the user and finally go to 'fillArguments' three times.",
            "If you explain this response to the user, the user will decide whether to call the function or not.",
            "",
          ].join("\n"),
        },
        ...histories.map((history): ChatCompletionMessageParam => {
          const role = history.speaker as "user" | "assistant";
          if (role === "user") {
            return {
              role: "user",
              content: JSON.stringify({
                room_id: history.room_id,
                user_id: history.user_id,
                speaker: history.speaker,
                created_at: history.created_at,
              }),
            };
          } else {
            return {
              role: "assistant",
              content: JSON.stringify({
                room_id: history.room_id,
                user_id: history.user_id,
                speaker: history.speaker,
                created_at: history.created_at,
              }),
            };
          }
        }),
        {
          role: "user",
          content: input.message,
        },
      ],
    });
  };
}
