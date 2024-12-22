import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { IEntity } from "../api/structures/common/IEntity";
import { ChatProvider } from "../providers/room/ChatProvider";
import { RoomProvider } from "../providers/room/RoomProvider";
import { History } from "./history";
import { System } from "./system";

export namespace AnswerAgent {
  export const opener = (user: IEntity) => async (input: IChatting.IChatInput) => {
    // 1. 유저의 방과 히스토리 정보를 조회한다.
    const room = await RoomProvider.findOneOrCreate(user)({ id: input.roomId });

    // 2. 방의 채팅 기록이 아무것도 없는 경우 시스템 프롬프트를 넣는다.
    const metadata = { userId: user.id, roomId: input.roomId };
    if (room.chattings.length === 0) {
      const systemPrompt = System.prompt();
      await ChatProvider.create({ ...metadata, speaker: "system", message: systemPrompt.content });
    }
  };

  /**
   * HTTP API
   */
  export const send =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse | null> => {
      // 1. 방이 생성되지 않은 경우라면 system prompt를 주입한다.
      const metadata = { userId: user.id, roomId: input.roomId };
      await AnswerAgent.opener(user)(input);

      // 2. 유저가 발화한 내용을 저장한다.
      await ChatProvider.create({ ...metadata, speaker: "user", message: input.message });

      // 3. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 4. 유저의 발화 내용을 기반으로 응답을 호출한다.
      const chatCompletion = await new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
      }).chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...History.prompt(room),
          {
            role: "user",
            content: input.message,
          },
        ],
      });

      console.log(JSON.stringify(History.prompt(room), null, 2));

      const answer = chatCompletion.choices[0].message.content;
      if (answer !== null) {
        // 5. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
        return await ChatProvider.create({
          userId: user.id,
          roomId: input.roomId,
          speaker: "assistent",
          message: answer,
        });
      }

      return null;
    };
}
