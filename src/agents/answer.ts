import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { IEntity } from "../api/structures/common/IEntity";
import { RoomProvider } from "../providers/room/RoomProvider";
import { History } from "./history";
import { System } from "./system";

export namespace AnswerAgent {
  /**
   * HTTP API
   */
  export const send = (user: IEntity) => async (input: IChatting.IChatInput) => {
    const room = await RoomProvider.at(user)({ id: input.roomId });

    return await new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        System.prompt(),
        ...History.prompt(room),
        {
          role: "user",
          content: input.message,
        },
      ],
    });
  };
}
