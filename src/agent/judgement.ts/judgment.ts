import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { ChatProvider } from "../../providers/room/ChatProvider";
import { RoomProvider } from "../../providers/room/RoomProvider";
import { System } from "./system";

/**
 * 유저의 발화가 들어올 때 최초의 응답을 `Judgment` 할 것이다.
 * 왜냐하면 이 응답으로 하여금, 유저에게 바로 응답을 할지,
 * 함수 선택을 할지 등 어떤 액션을 취할지 아직 모르기 때문이다.
 * 따라서, `Judgment`의 역할은 어떤 응답을 할지를 의미한다고 볼 수 있다.
 */
export namespace JudgmentAgent {
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

  export const answer = (user: IEntity) => (input: IChatting.IChatInput) => {
    const metadata = { userId: user.id, roomId: input.roomId };
  };
}
