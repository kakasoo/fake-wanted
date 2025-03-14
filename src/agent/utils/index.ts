import { ChatCompletion } from "openai/resources";
import typia from "typia";

import { MessageType as AnswerMessageType } from "../answer/IMessageType";
import { MessageType as FillArgumentMessageType } from "../fillArugment/IMessageType";
import { MessageType as JudgementMessageType } from "../judgement/IMessageType";
import { MessageType as RunFunctionMessageType } from "../runFunction/IMessageType";
import { MessageType as SelectFunctionMessageType } from "../selectFunction/IMessageType";

export namespace AgentUtil {
  export namespace Content {
    export function runFunction(input: ChatCompletion): RunFunctionMessageType {
      const tool = input.choices[0].message.tool_calls?.at(0)?.function.arguments;
      const validTool = typia.json.isParse<RunFunctionMessageType>(tool ?? "{}");
      if (validTool !== null) {
        return validTool;
      }

      const content = input.choices.at(0)?.message.content ?? null;
      if (content === null) {
        throw new Error(`runFunction content is nothing.`);
      }

      const response = content === null ? null : typia.json.isParse<RunFunctionMessageType>(content);
      if (response === null) {
        const parsed = { ...JSON.parse(content), type: "runFunction" };
        if (typia.is<RunFunctionMessageType>(parsed)) {
          return parsed;
        }

        throw new Error(`invalid runFunction message type: ${content}`);
      }

      return response;
    }

    export function fillArgument(input: ChatCompletion): FillArgumentMessageType {
      const tool = input.choices[0].message.tool_calls?.at(0)?.function.arguments;
      const validTool = typia.json.isParse<FillArgumentMessageType>(tool ?? "{}");
      if (validTool !== null) {
        return validTool;
      }

      const content = input.choices.at(0)?.message.content ?? null;
      if (content === null) {
        throw new Error(`fillArgument content is nothing.`);
      }

      const response = content === null ? null : typia.json.isParse<FillArgumentMessageType>(content);
      if (response === null) {
        const parsed = { ...JSON.parse(content), type: "fillArgument" };
        if (typia.is<FillArgumentMessageType>(parsed)) {
          return parsed;
        }

        throw new Error(`invalid fillArgument message type: ${content}`);
      }

      return response;
    }

    export function selectFunction(input: ChatCompletion): SelectFunctionMessageType {
      const tool = input.choices[0].message.tool_calls?.at(0)?.function.arguments;
      const validTool = typia.json.isParse<SelectFunctionMessageType>(tool ?? "{}");
      if (validTool !== null) {
        return validTool;
      }

      const content = input.choices.at(0)?.message.content ?? null;
      if (content === null) {
        throw new Error(`selectFunction content is nothing.`);
      }

      const response = content === null ? null : typia.json.isParse<SelectFunctionMessageType>(content);
      if (response === null) {
        const parsed = { ...JSON.parse(content), type: "selectFunction" };
        if (typia.is<SelectFunctionMessageType>(parsed)) {
          return parsed;
        }

        throw new Error(`invalid selectFunction message type: ${content}`);
      }

      return response;
    }

    export function judgement(input: ChatCompletion): JudgementMessageType {
      const tool = input.choices[0].message.tool_calls?.at(0)?.function.arguments;
      const validTool = typia.json.isParse<JudgementMessageType>(tool ?? "{}");
      if (validTool !== null) {
        return validTool;
      }

      const content = input.choices.at(0)?.message.content ?? null;
      const response = content === null ? null : typia.json.isParse<JudgementMessageType>(content);
      if (content === null) {
        throw new Error(`judgement content is nothing.`);
      }

      if (response === null) {
        const parsed = { ...JSON.parse(content), type: "judgement" };
        if (typia.is<JudgementMessageType>(parsed)) {
          return parsed;
        }

        throw new Error(`invalid judgement message type: ${content}`);
      }

      return response;
    }

    export function answer(input: ChatCompletion): AnswerMessageType {
      const tool = input.choices[0].message.tool_calls?.at(0)?.function.arguments;
      const validTool = typia.json.isParse<AnswerMessageType>(tool ?? "{}");
      if (validTool !== null) {
        return validTool;
      }

      const content = input.choices.at(0)?.message.content ?? null;
      if (content === null) {
        throw new Error(`answer content is nothing.`);
      }

      const response = content === null ? null : typia.json.isParse<AnswerMessageType>(content);
      if (response === null) {
        const parsed = { ...JSON.parse(content), type: "answer" };
        if (typia.is<AnswerMessageType>(parsed)) {
          return parsed;
        }

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
