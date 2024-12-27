import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { System } from "./system";

export namespace SelectFunctionAgent {
  export const chat = (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async () => {
    const histories = Scribe.prompt(room, ["selectFunction"]);

    const systemPrompt = histories.find((el) => {
      return el.role === "system" && el.system_role === "selectFunction";
    });

    const chatCompletion = await new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...histories,
        ...(systemPrompt ? [] : [System.prompt()]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
      ],
    });

    return AgentUtil.getContent("selectFunction")(chatCompletion);
  };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 2. 유저의 발화 내용을 기반으로 응답을 호출한다.
      const answer = await SelectFunctionAgent.chat(room)();
      const response = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: JSON.stringify(answer),
        role: null,
      });

      return [response];
    };
}
