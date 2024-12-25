import { ChatCompletion } from "openai/resources";
import typia from "typia";

import { MessageType as AnswerMessageType } from "../answer/IMessageType";
import { MessageType as JudgementMessageType } from "../judgement/IMessageType";

export namespace AgentUtil {
  export namespace Content {
    export function judgement(input: ChatCompletion): JudgementMessageType {
      console.log("judgement: ", JSON.stringify(input, null, 2));

      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<JudgementMessageType | null>(content);
      if (response === null) {
        const multipleAnswers = content === null ? null : typia.json.isParse<{ type: JudgementMessageType }>(content);
        if (multipleAnswers) {
          console.log(`invalid type but allow \`multipleAnswer\`: ${JSON.stringify(multipleAnswers)}`);
          return multipleAnswers.type;
        }

        throw new Error(`invalid message type: ${content}`);
      }

      return response;
    }

    export function anwer(input: ChatCompletion): AnswerMessageType {
      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<AnswerMessageType | null>(content);
      if (response === null) {
        const message = JSON.parse(content ?? "{}").message;
        if (message) {
          // 타입이 빠졌을 뿐, 실제로는 메세지가 있는 경우 강제로 chat 타입으로 변환한다.
          return { type: "chat", message: message };
        }
        throw new Error(`invalid message type: ${content}`);
      }

      return response;
    }
  }

  export function getContent(role: "answer"): typeof AgentUtil.Content.anwer;
  export function getContent(role: "judgement"): typeof AgentUtil.Content.judgement;
  export function getContent(role: "answer" | "judgement") {
    if (role === "answer") {
      return AgentUtil.Content.anwer;
    } else if (role === "judgement") {
      return AgentUtil.Content.judgement;
    } else {
      throw new Error(`invalid role type: ${role}`);
    }
  }
}
