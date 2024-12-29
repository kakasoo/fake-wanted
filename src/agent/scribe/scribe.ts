import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";
import typia from "typia";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";

import { RoomProvider } from "../../providers/room/RoomProvider";
import { MessageType } from "../judgement/IMessageType";

export namespace Scribe {
  export function prompt<T extends IAgent.Role[]>(
    room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>,
    roles?: T,
  ): (Omit<
    Pick<
      ChatCompletionSystemMessageParam | ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam,
      "role"
    >,
    "content"
  > & {
    content: string;
    system_role: T[number];
    type?: MessageType["type"];
  })[] {
    if (room.chattings.length === 0) {
      return [];
    }

    return room.chattings
      .filter((history) => {
        if (history.speaker === "system" && history.role) {
          if (history.role === null) {
            return true; // 하위호환성 유지를 위해 null인 경우는 모두 허용한다.
          }

          if (typia.is<IAgent.Role>(history.role)) {
            // 만약 `roles`가 명시된 경우, 명시된 역할의 히스토리만 남기도록 한다.
            if (roles?.includes(history.role)) {
              return true;
            }
          }
          return false;
        }

        // 시스템 프롬프트가 아닌 경우는 대화 맥락이므로 전부 허용해야 한다.
        return true;
      })
      .map(
        (
          history,
        ): Omit<
          Pick<
            ChatCompletionSystemMessageParam | ChatCompletionUserMessageParam | ChatCompletionAssistantMessageParam,
            "role"
          >,
          "content"
        > & {
          content: string;
          system_role: IAgent.Role;
          type?: MessageType["type"];
        } => {
          const role = history.speaker as "user" | "assistant" | "system";
          if (role === "user") {
            return {
              role: "user",
              content: history.message,
              system_role: null,
            };
          } else if (role === "system") {
            return {
              role: "system",
              content: history.message,
              system_role: typia.is<IAgent.Role>(history.role) ? history.role : null,
            };
          } else {
            return {
              role: "assistant",
              content: history.message,
              system_role: null,
              type: JSON.parse(history.message).type as MessageType["type"],
            };
          }
        },
      );
  }
}
