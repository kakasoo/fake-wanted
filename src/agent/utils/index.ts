import { ChatCompletion } from "openai/resources";
import typia from "typia";

import { MessageType as AnswerMessageType } from "../answer/IMessageType";

export namespace AgentUtil {
  export const getContent =
    (agent: "answer") =>
    (input: ChatCompletion): AnswerMessageType | null => {
      const content = input.choices.at(0)?.message.content ?? null;
      if (agent === "answer") {
        const response = content === null ? null : typia.json.isParse<AnswerMessageType | null>(content);
        if (response === null) {
          const message = JSON.parse(content ?? "{}").message;
          if (message) {
            // 타입이 빠졌을 뿐, 실제로는 메세지가 있는 경우 강제로 chat 타입으로 변환한다.
            return { type: "chat", message: message };
          }
          throw new Error(`invalid message type: ${input}`);
        }

        return response;
      } else {
        throw new Error(`Invalid agent type: ${agent}`);
      }
    };
}
