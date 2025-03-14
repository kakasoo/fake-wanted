import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { MyGlobal } from "../../MyGlobal";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { AnswerAgent } from "../answer/answer";
import { FillArgumentAgent } from "../fillArugment/fillArgument";
import { Opener } from "../opener/opener";
import { RunFunctionAgent } from "../runFunction/runFunction";
import { Scribe } from "../scribe/scribe";
import { SelectFunctionAgent } from "../selectFunction/selectFunction";
import { AgentUtil } from "../utils";
import { MessageType } from "./IMessageType";
import { System } from "./system";

/**
 * 유저의 발화가 들어올 때 최초의 응답을 `Judgement` 할 것이다.
 * 왜냐하면 이 응답으로 하여금, 유저에게 바로 응답을 할지,
 * 함수 선택을 할지 등 어떤 액션을 취할지 아직 모르기 때문이다.
 * 따라서, `Judgement`의 역할은 어떤 응답을 할지를 의미한다고 볼 수 있다.
 */
export namespace JudgementAgent {
  export const call = async (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => {
    const histories = Scribe.prompt(room, ["judgement", "opener"]);

    const systemPrompt = histories.find((el) => {
      return el.role === "system" && el.system_role === "judgement";
    });

    const last_message_type = histories.findLast((el) => el.role === "assistant")?.type ?? null;

    const chatCompletion = await new OpenAI({
      apiKey: MyGlobal.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...(systemPrompt ? [] : [System.prompt()]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
        ...histories,
      ],
      tools: last_message_type !== null ? MessageType.Functions[last_message_type] : MessageType.functions,
      tool_choice: "required",
      parallel_tool_calls: false,
    });

    return chatCompletion;
  };

  export const chat = (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async () => {
    const chatCompletion = await JudgementAgent.call(room);
    return AgentUtil.getContent("judgement")(chatCompletion);
  };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 최초의 방이 열린 것인지 체크한다.
      await Opener.open(user)(input);

      // 2. 유저가 발화한 내용을 저장한다.
      const metadata = { userId: user.id, roomId: input.roomId };
      await ChatProvider.create({ ...metadata, speaker: "user", message: input.message, role: null });

      while (true) {
        // 3. 방 정보를 넣고 judgementAgent의 판단을 대기한다.
        const room = await RoomProvider.at(user)({ id: input.roomId });
        const response = await JudgementAgent.chat(room)();
        console.log(`response of judgement: ${JSON.stringify(response)}`);
        try {
          console.time(response.type);
          if (response.type === "chat") {
            return await AnswerAgent.answer(user)(input);
          } else if (response.type === "selectFunction") {
            await SelectFunctionAgent.answer(user)(input);
          } else if (response.type === "fillArgument") {
            await FillArgumentAgent.answer(user)(input);
          } else if (response.type === "runFunction") {
            await RunFunctionAgent.answer(user)(input);
          } else {
            throw new Error(`invalid judgement response type: ${JSON.stringify(response)}`);
          }
        } catch (err) {
          console.error(err);
        } finally {
          console.timeEnd(response.type);
        }
      }
    };
}
