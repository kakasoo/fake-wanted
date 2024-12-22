import { ChatCompletionMessageParam } from "openai/resources";

import { RoomProvider } from "../providers/room/RoomProvider";

export namespace History {
  export function prompt(room: Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>) {
    if (room.chattings.length === 0) {
      return [];
    }

    return room.chattings.map((history): ChatCompletionMessageParam => {
      const role = history.speaker as "user" | "assistant";
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
        };
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
        };
      }
    });
  }
}
