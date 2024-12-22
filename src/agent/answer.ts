import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { IEntity } from "../api/structures/common/IEntity";
import { ChatProvider } from "../providers/room/ChatProvider";
import { RoomProvider } from "../providers/room/RoomProvider";
import { History } from "./history";
import { System } from "./system";

export namespace AnswerAgent {
  /**
   * HTTP API
   */
  export const send = (user: IEntity) => async (input: IChatting.IChatInput) => {
    // 1. 유저가 발화한 내용을 저장한다.
    await ChatProvider.create({ userId: user.id, roomId: input.roomId, speaker: "user", message: input.message });

    // 2. 유저의 방과 히스토리 정보를 조회한다.
    const room = await RoomProvider.at(user)({ id: input.roomId });

    // 3. 유저의 발화 내용을 기반으로 대화를 전송한다.
    const chatCompletion = await new OpenAI({
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

    const answer = chatCompletion.choices[0].message.content;
    if (answer !== null) {
      // 4. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
      return await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistent",
        message: answer,
      });
    }
  };
}
