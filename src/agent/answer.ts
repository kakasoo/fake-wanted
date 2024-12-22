import axios from "axios";
import OpenAI from "openai";
import { ChatCompletion } from "openai/resources";
import typia from "typia";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { MyConfiguration } from "../MyConfiguration";
import { MessageType } from "../api/structures/agent/IMessageType";
import { IEntity } from "../api/structures/common/IEntity";
import { ChatProvider } from "../providers/room/ChatProvider";
import { RoomProvider } from "../providers/room/RoomProvider";
import { createQueryParameter } from "../utils/createQueryParameter";
import { History } from "./history";
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

  export const chat =
    (room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) => async (input: { message: string }) => {
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

      return chatCompletion;
    };

  export const getContent = (input: ChatCompletion): MessageType | null => {
    const content = input.choices.at(0)?.message.content ?? null;
    const response = content === null ? null : typia.json.isParse<MessageType | null>(content);
    if (response === null) {
      const message = JSON.parse(content ?? "{}").message;
      if (message) {
        // 타입이 빠졌을 뿐, 실제로는 메세지가 있는 경우 강제로 chat 타입으로 변환한다.
        return { type: "chat", message: message };
      }
      throw new Error(`invalid message type: ${input}`);
    }

    return response;
  };

  /**
   * HTTP API
   */
  export const send =
    (user: IEntity) =>
    async (input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> => {
      // 1. 방이 생성되지 않은 경우라면 system prompt를 주입한다.
      const metadata = { userId: user.id, roomId: input.roomId };
      await AnswerAgent.opener(user)(input);

      // 2. 유저가 발화한 내용을 저장한다.
      await ChatProvider.create({ ...metadata, speaker: "user", message: input.message });

      // 3. 다시 방의 최신 대화 내용을 불러온다.
      const room = await RoomProvider.at(user)({ id: input.roomId });

      // 4. 유저의 발화 내용을 기반으로 응답을 호출한다.
      const chatCompletion = await AnswerAgent.chat(room)(input);

      const answer = AnswerAgent.getContent(chatCompletion);
      console.log(0);
      if (answer !== null) {
        // 5. LLM 응답이 있는 경우 발화 내용을 히스토리에 저장한다.
        const response = await ChatProvider.create({
          userId: user.id,
          roomId: input.roomId,
          speaker: "assistent",
          message: answer.message,
        });

        console.log(1);
        const parsed = typia.is<MessageType.FillArgument>(answer);
        console.log(2);
        if (parsed === true) {
          console.log(3);
          const called = await AnswerAgent.functionCall(answer);
          console.log(4);
          const functionCallHistory = await ChatProvider.create({
            userId: user.id,
            roomId: input.roomId,
            speaker: "system",
            message: JSON.stringify(called, null, 2),
          });
          console.log(5);

          const chatCompletion = await AnswerAgent.chat(room)({ message: called });
          console.log(6);
          const docent = AnswerAgent.getContent(chatCompletion);
          console.log(7);
          if (docent) {
            console.log(8);
            const docentHistory = await ChatProvider.create({
              userId: user.id,
              roomId: input.roomId,
              speaker: "assistent",
              message: docent.message,
            });
            console.log(9);

            return [response, functionCallHistory, docentHistory];
          }
          console.log(10);
        }

        console.log(11, JSON.stringify(response, null, 2));
        return [response];
      }

      return null;
    };
}
