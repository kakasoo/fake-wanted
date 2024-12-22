import { Prisma } from "@prisma/client";

import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { prisma } from "../common/PrismaProvider";
import { ChatProvider } from "./ChatProvider";

export namespace RoomProvider {
  export namespace summary {
    export const select = () => {
      return {
        select: {
          id: true,
          user_id: true,
          created_at: true,
          chattings: ChatProvider.summary.select(),
        },
      } satisfies Prisma.roomFindFirstArgs;
    };
  }

  export const findOneOrCreate = (user: IEntity) => async (room: IEntity) => {
    const target = await RoomProvider.getOne(user)(room);
    if (!target) {
      return await RoomProvider.create(user)(room);
    }

    return target;
  };

  export const create = (user: IEntity) => async (room: IEntity) => {
    return await prisma.room.create({
      ...RoomProvider.summary.select(),
      data: {
        id: room.id,
        user_id: user.id,
        created_at: new Date().toISOString(),
      },
    });
  };

  export const getOne = (user: IEntity) => async (room: IEntity) => {
    const target = await prisma.room.findFirst({
      ...RoomProvider.summary.select(),
      where: {
        id: room.id,
        user_id: user.id,
      },
    });

    return target;
  };

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
            message: chatting.message,
            created_at: chatting.created_at.toISOString(),
            deleted_at: chatting.deleted_at?.toISOString(),
          };
        }),
    };
  };
}
