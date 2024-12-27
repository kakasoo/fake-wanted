import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { MyGlobal } from "../../MyGlobal";
import { IEntity } from "../../api/structures/common/IEntity";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { System } from "./system";

export namespace AnswerAgent {
  export const chat = (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async () => {
    const histories = Scribe.prompt(room, ["answer", "opener"]);

    const systemPrompt = histories.find((el) => {
      return el.role === "system" && el.system_role === "answer";
    });

    const chatCompletion = await new OpenAI({
      apiKey: MyGlobal.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...histories,
        ...(systemPrompt ? [] : [System.prompt()]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
      ],
    });

    return AgentUtil.getContent("answer")(chatCompletion);
  };

  /**
   * HTTP API
   */
  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 2. 유저의 발화 내용을 기반으로 응답을 호출한다.
      const answer = await AnswerAgent.chat(room)();

      // 3. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
      const response = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: JSON.stringify(answer, null, 2),
        role: null,
      });

      return [response];
    };
}
