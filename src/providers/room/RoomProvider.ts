import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { prisma } from "../common/PrismaProvider";

export namespace RoomProvider {
  export const at = (user: IEntity) => async (room: IEntity) => {
    const target = await prisma.room.findFirstOrThrow({
      include: {
        chattings: true,
      },
      where: {
        id: room.id,
        user_id: user.id,
      },
    });

    return {
      id: target.id,
      user_id: target.user_id,
      created_at: target.created_at.toISOString(),
      chattings: target.chattings
        .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
        .map((chatting) => {
          return {
            id: chatting.id,
            room_id: chatting.room_id,
            user_id: chatting.user_id,
            speaker: chatting.speaker,
            created_at: chatting.created_at.toISOString(),
            deleted_at: chatting.deleted_at?.toISOString(),
          };
        }),
    };
  };
}
