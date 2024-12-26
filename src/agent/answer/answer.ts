import axios from "axios";
import OpenAI from "openai";
import typia from "typia";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";
import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { MyConfiguration } from "../../MyConfiguration";
import { IEntity } from "../../api/structures/common/IEntity";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { createQueryParameter } from "../../utils/createQueryParameter";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { MessageType } from "./IMessageType";
import { System } from "./system";

export namespace AnswerAgent {
  export const functionCall = async (parsed: MessageType.FillArgument) => {
    const query = createQueryParameter(parsed.parameters.query ?? {});
    const url = `http://localhost:${MyConfiguration.API_PORT()}${parsed.pathname}?${query}`;

    console.log(JSON.stringify({ url, ...parsed }, null, 2));
    let response;
    if (parsed.method === "get") {
      response = await axios.get(url, {});
    } else {
      response = await axios[parsed.method](url, parsed.parameters.body ?? {});
    }

    return response.data;
  };

  export const chat =
    (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async (input: { message: string }) => {
      const histories = Scribe.prompt(room, ["answer"]);

      // answer의 시스템 프롬프트가 1번 이상 들어가는 것을 방지하기 위해 탐색
      const systemPrompt = histories.find((el) => {
        return el.role === "system" && (JSON.parse(el.content).role as IAgent.Role) === "answer";
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
      const answer = await AnswerAgent.chat(room)(input);

      console.log(0);
      if (answer !== null) {
        // 3. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
        const response = await ChatProvider.create({
          userId: user.id,
          roomId: input.roomId,
          speaker: "assistent",
          message: answer.message,
          role: null,
        });

        console.log(1);
        const isFillArguementType = typia.is<MessageType.FillArgument>(answer);
        console.log(2);
        if (isFillArguementType === true) {
          console.log(3);
          const called: unknown = await AnswerAgent.functionCall(answer);
          console.log(4);
          await ChatProvider.create({
            userId: user.id,
            roomId: input.roomId,
            speaker: "system",
            message: [
              "The server called the function on behalf of LLM.",
              "Please explain to the user based on this response.",
              "The below code is result of a function response called by the server on behalf of LLM.",
              JSON.stringify(called, null, 2),
              "The above code is result of a function response called by the server on behalf of LLM.",
            ].join("\n"),
            role: "runFunction",
          });
          console.log(5, called);

          const docent = await AnswerAgent.chat(room)({ message: JSON.stringify(called, null, 2) });
          console.log(7);
          if (docent) {
            console.log(8);
            const docentHistory = await ChatProvider.create({
              userId: user.id,
              roomId: input.roomId,
              speaker: "assistent",
              message: docent.message,
              role: null,
            });
            console.log(9);

            return [response, docentHistory];
          }
          console.log(10);
        }

        console.log(11, JSON.stringify(response, null, 2));
        return [response];
      }

      return null;
    };
}
