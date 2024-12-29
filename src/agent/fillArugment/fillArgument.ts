import OpenAI from "openai";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";
import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { MyGlobal } from "../../MyGlobal";
import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { Scribe } from "../scribe/scribe";
import { AgentUtil } from "../utils";
import { MessageType } from "./IMessageType";
import { System } from "./system";

export namespace FillArgumentAgent {
  export const chat =
    (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) =>
    async (runFunction: boolean = false) => {
      const types: IAgent.Role[] = ["fillArgument", "selectFunction", "opener"];
      const histories = Scribe.prompt(room, types);

      if (histories.some((el) => !types.includes(el.system_role))) {
        throw new Error("Invalid system_role_type injected!");
      }

      const systemPrompt = histories.find((el) => {
        return el.role === "system" && el.system_role === "fillArgument";
      });

      const selectedFunctionHistories = histories.filter(
        (el) => el.role === "system" && el.system_role === "selectFunction",
      );

      const chatCompletion = await new OpenAI({
        apiKey: MyGlobal.env.OPEN_AI_KEY,
      }).chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...(systemPrompt ? [] : [System.prompt(selectedFunctionHistories)]), // Answer 용 시스템 프롬프트가 주입 안된 경우에 주입한다.
          ...histories,
          ...(runFunction === true
            ? [
                {
                  role: "system",
                  content: [
                    "Based on the previous conversation,",
                    "finally return the FillArgument type object that the user wants to call.",
                    "You should look at the query, parameter, and body in the previous conversation and move all the previous values as they are.",
                    "If necessary, you may use the context of the conversation to fill in the insufficient factors.",
                    "However, the key names originally filled must be kept very strict.",
                  ].join("\n"),
                } as const,
              ]
            : []),
        ],
        tools: MessageType.functions,
        tool_choice: "required",
        parallel_tool_calls: false,
      });

      return AgentUtil.getContent("fillArgument")(chatCompletion);
    };

  export const answer =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 2. 유저의 발화 내용을 기반으로 응답을 호출한다.
      const answer = await FillArgumentAgent.chat(room)();

      // 3. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
      const response = await ChatProvider.create({
        userId: user.id,
        roomId: input.roomId,
        speaker: "assistant",
        message: JSON.stringify(answer, null, 2),
        role: null,
      });

      console.log("response of fillArgument: ", JSON.stringify(answer, null, 2));

      return [response];
    };
}
