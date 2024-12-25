import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { RoomProvider } from "../../providers/room/RoomProvider";
import { AnswerAgent } from "../answer/answer";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";

/**
 * 유저의 발화가 들어올 때 최초의 응답을 `Judgement` 할 것이다.
 * 왜냐하면 이 응답으로 하여금, 유저에게 바로 응답을 할지,
 * 함수 선택을 할지 등 어떤 액션을 취할지 아직 모르기 때문이다.
 * 따라서, `Judgement`의 역할은 어떤 응답을 할지를 의미한다고 볼 수 있다.
 */
export namespace JudgementAgent {
  export const chat =
    (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async (input: { message: string }) => {
      const chatCompletion = await new OpenAI({
        apiKey: process.env.OPEN_AI_KEY,
      }).chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...Scribe.prompt(room),
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
      return AnswerAgent.answer(user)(input);
    };
}
