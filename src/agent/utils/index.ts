import { ChatCompletion } from "openai/resources";
import typia from "typia";

import { MessageType as AnswerMessageType } from "../answer/IMessageType";
import { MessageType as FillArgumentMessageType } from "../fillArugment/IMessageType";
import { MessageType as JudgementMessageType } from "../judgement/IMessageType";
import { MessageType as SelectFunctionMessageType } from "../selectFunction/IMessageType";

export namespace AgentUtil {
  export namespace Content {
    export function runFunction(input: ChatCompletion) {
      const content = input.choices.at(0)?.message.content ?? null;
      return content;
    }

    export function fillArgument(input: ChatCompletion): FillArgumentMessageType {
      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<FillArgumentMessageType | null>(content);
      if (response === null) {
        throw new Error(`invalid fillArgument message type: ${content}`);
      }

      return response;
    }

    export function selectFunction(input: ChatCompletion): SelectFunctionMessageType {
      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<SelectFunctionMessageType | null>(content);
      if (response === null) {
        throw new Error(`invalid selectFunction message type: ${content}`);
      }

      return response;
    }

    export function judgement(input: ChatCompletion): JudgementMessageType {
      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<JudgementMessageType>(content);
      if (response === null) {
        throw new Error(`invalid judgement message type: ${content}`);
      }

      return response;
    }

    export function answer(input: ChatCompletion): AnswerMessageType {
      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<AnswerMessageType | null>(content);
      if (response === null) {
        const message = JSON.parse(content ?? "{}").message;
        if (message) {
          // 타입이 빠졌을 뿐, 실제로는 메세지가 있는 경우 강제로 chat 타입으로 변환한다.
          return { type: "chat", message: message };
        }
        throw new Error(`invalid answer message type: ${content}`);
      }

      return response;
    }
  }

  export function getContent(role: "runFunction"): typeof AgentUtil.Content.runFunction;
  export function getContent(role: "fillArgument"): typeof AgentUtil.Content.fillArgument;
  export function getContent(role: "selectFunction"): typeof AgentUtil.Content.selectFunction;
  export function getContent(role: "answer"): typeof AgentUtil.Content.answer;
  export function getContent(role: "judgement"): typeof AgentUtil.Content.judgement;
  export function getContent(role: "answer" | "judgement" | "selectFunction" | "fillArgument" | "runFunction") {
    if (role === "answer") {
      return AgentUtil.Content.answer;
    } else if (role === "judgement") {
      return AgentUtil.Content.judgement;
    } else if (role === "selectFunction") {
      return AgentUtil.Content.selectFunction;
    } else if (role === "fillArgument") {
      return AgentUtil.Content.fillArgument;
    } else if (role === "runFunction") {
      return AgentUtil.Content.runFunction;
    } else {
      throw new Error(`invalid role type: ${role}`);
    }
  }
}
