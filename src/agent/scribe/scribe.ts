import { ChatCompletionMessageParam } from "openai/resources";
import typia from "typia";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";

import { RoomProvider } from "../../providers/room/RoomProvider";

export namespace Scribe {
  export function prompt(room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>, roles?: IAgent.Role[]) {
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
      .map((history): ChatCompletionMessageParam & { content: string } => {
        const role = history.speaker as "user" | "assistant" | "system";
        if (role === "user") {
          return {
            role: "user",
            content: JSON.stringify({
              room_id: history.room_id,
              user_id: history.user_id,
              speaker: history.speaker,
              message: history.message,
              created_at: history.created_at,
            }),
          } satisfies ChatCompletionMessageParam;
        } else if (role === "system") {
          return {
            role: "system",
            content: JSON.stringify({
              room_id: history.room_id,
              user_id: history.user_id,
              speaker: history.speaker,
              role: history.role,
              message: history.message,
              created_at: history.created_at,
            }),
          } satisfies ChatCompletionMessageParam;
        } else {
          return {
            role: "assistant",
            content: JSON.stringify({
              room_id: history.room_id,
              user_id: history.user_id,
              speaker: history.speaker,
              message: history.message,
              created_at: history.created_at,
            }),
          } satisfies ChatCompletionMessageParam;
        }
      });
  }
}
