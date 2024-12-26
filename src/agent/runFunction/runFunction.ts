import axios from "axios";
import OpenAI from "openai";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";
import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { MyConfiguration } from "../../MyConfiguration";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { createQueryParameter } from "../../utils/createQueryParameter";
import { AnswerAgent } from "../answer/answer";
import { MessageType as FillArugmentMessageType } from "../fillArugment/IMessageType";
import { FillArgumentAgent } from "../fillArugment/fillArgument";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { System } from "./system";

export namespace RunFunctionAgent {
  export const functionCall = async (parsed: FillArugmentMessageType) => {
    const query = createQueryParameter(parsed.parameters.query ?? {});
    const url = `http://localhost:${MyConfiguration.API_PORT()}${parsed.pathname}?${query}`;

    let response;
    if (parsed.method === "get") {
      response = await axios.get(url, {});
    } else {
      response = await axios[parsed.method](url, parsed.parameters.body ?? {});
    }

    return response.data;
  };

  export const chat = (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async () => {
    const histories = Scribe.prompt(room, ["runFunction", "opener"]);

    // answer의 시스템 프롬프트가 1번 이상 들어가는 것을 방지하기 위해 탐색
    const systemPrompt = histories.find((el) => {
      return el.role === "system" && (JSON.parse(el.content).role as IAgent.Role) === "runFunction";
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

    return AgentUtil.getContent("runFunction")(chatCompletion);
  };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      const fillArgument = await FillArgumentAgent.chat(room)(true);

      console.log("runFunction's fillArgument: ", JSON.stringify(fillArgument, null, 2));
      const called: unknown = await RunFunctionAgent.functionCall(fillArgument);
      const response = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: [
          "The server called the function on behalf of LLM.",
          "Please explain to the user based on this response.",
          "The below code is result of a function response called by the server on behalf of LLM.",
          JSON.stringify(called, null, 2),
          "The above code is result of a function response called by the server on behalf of LLM.",
        ].join("\n"),
        role: null,
      });
      console.log(5, called);

      const docent = await AnswerAgent.chat(room)();
      console.log(7);

      console.log(8);
      const docentHistory = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: JSON.stringify(docent),
        role: null,
      });
      console.log(9);

      return [response, docentHistory];
    };
}
