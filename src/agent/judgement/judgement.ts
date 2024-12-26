import OpenAI from "openai";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";
import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { RoomProvider } from "../../providers/room/RoomProvider";
import { AnswerAgent } from "../answer/answer";
import { Opener } from "../opener/opener";
import { Scribe } from "../scribe/scribe";
import { SelectFunctionAgent } from "../selectFunction/selectFunction";
import { AgentUtil } from "../utils";
import { System } from "./system";

/**
 * 유저의 발화가 들어올 때 최초의 응답을 `Judgement` 할 것이다.
 * 왜냐하면 이 응답으로 하여금, 유저에게 바로 응답을 할지,
 * 함수 선택을 할지 등 어떤 액션을 취할지 아직 모르기 때문이다.
 * 따라서, `Judgement`의 역할은 어떤 응답을 할지를 의미한다고 볼 수 있다.
 */
export namespace JudgementAgent {
  export const chat =
    (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async (input: { message: string }) => {
      const histories = Scribe.prompt(room, ["answer"]);

      // answer의 시스템 프롬프트가 1번 이상 들어가는 것을 방지하기 위해 탐색
      const systemPrompt = histories.find((el) => {
        return el.role === "system" && (JSON.parse(el.content).role as IAgent.Role) === "judgement";
      });

      const chatCompletion = await new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
      }).chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...(systemPrompt ? [] : [System.prompt()]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
          ...histories,
          {
            role: "user",
            content: input.message,
          },
        ],
      });

      return AgentUtil.getContent("judgement")(chatCompletion);
    };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      await Opener.open(user)(input);
      const room = await RoomProvider.at(user)({ id: input.roomId });
      const response = await JudgementAgent.chat(room)({ message: input.message });

      console.log(`respnose of judgement: ${response}`);
      if (response.type === "chat") {
        // Chat인 경우 AnswerAgent의 answer로 이어지게 한다.
        return AnswerAgent.answer(user)(input);
      } else if (response.type === "selectFunction") {
        return SelectFunctionAgent.answer(user)(input);
      } else {
        throw new Error(`invalid judgement response type: ${response}`);
      }
    };
}
