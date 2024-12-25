import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { System } from "./system";

export namespace Opener {
  /**
   * 최초로 방이 열렸을 때, 시스템 프롬프트를 주입하는 역할을 한다.
   * 이 시스템 프롬프트는, 모든 에이전트 간 공유해야 할 시스템 프롬프트를 의미한다.
   * 채팅을 걸지는 아니하고, 프롬프트를 주입하는 데까지의 역할을 수행한다.
   *
   * @param user
   * @returns
   */
  export const open = (user: IEntity) => async (input: IChatting.IChatInput) => {
    // 1. 유저의 방과 히스토리 정보를 조회한다.
    const room = await RoomProvider.findOneOrCreate(user)({ id: input.roomId });

    // 2. 방의 채팅 기록이 아무것도 없는 경우 시스템 프롬프트를 넣는다.
    const metadata = { userId: user.id, roomId: input.roomId };
    if (room.chattings.length === 0) {
      const systemPrompt = System.prompt();
      await ChatProvider.create({ ...metadata, speaker: "system", message: systemPrompt.content });
    }
  };
}
