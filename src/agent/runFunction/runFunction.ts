import axios from "axios";
import OpenAI from "openai";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { MyConfiguration } from "../../MyConfiguration";
import { MyGlobal } from "../../MyGlobal";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { createQueryParameter } from "../../utils/createQueryParameter";
import { MessageType as FillArugmentMessageType } from "../fillArugment/IMessageType";
import { FillArgumentAgent } from "../fillArugment/fillArgument";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { MessageType } from "./IMessageType";
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

    const calledPrompt = histories.toReversed().find((el) => {
      const isSystemPrompt = el.role === "system" && el.system_role === "runFunction";
      if (isSystemPrompt) {
        return true;
      }

      const isAssistantMessage = el.role === "assistant" && el.type === "runFunction";
      if (isAssistantMessage) {
        return true;
      }

      return false;
    });

    if (!calledPrompt) {
      throw new Error("Cannot explain response of function execution. beacause of any function doesn't run.");
    }

    const systemPrompt = histories.find((el) => {
      return el.role === "system" && el.system_role === "runFunction";
    });

    const chatCompletion = await new OpenAI({
      apiKey: MyGlobal.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        ...(systemPrompt ? [] : [System.prompt()]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
        ...histories,
        {
          role: "user",
          content: [
            "Can you get the context I've been talking about so far,",
            "and explain the results of the previous function call in as much detail as possible?",
          ].join("\n"),
        },
      ],
      tools: MessageType.functions,
      tool_choice: "required",
      parallel_tool_calls: false,
    });

    return AgentUtil.getContent("runFunction")(chatCompletion);
  };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 2. 이전 fillArgument를 꺼내어서 함수를 호출한다.
      const fillArgument = await FillArgumentAgent.chat(room)(true);
      const called: unknown = await RunFunctionAgent.functionCall(fillArgument);

      // 3. 호출 결과를 시스템 프롬프트로 주입한다.
      const response = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: JSON.stringify(
          {
            type: "runFunction",
            message: [
              "The server called the function on behalf of LLM.",
              "Please explain to the user based on this response.",
              "The below code is result of a function response called by the server on behalf of LLM.",
              "<RESPONSE>",
              JSON.stringify(called, null, 2),
              "</RESPONSE>",
            ].join("\n"),
          },
          null,
          2,
        ),
        role: null,
      });

      return [response];
    };
}
