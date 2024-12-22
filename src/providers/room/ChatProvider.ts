import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { prisma } from "../common/PrismaProvider";

export namespace ChatProvider {
  export namespace summary {
    export function transform(
      input: Prisma.chattingGetPayload<ReturnType<typeof ChatProvider.summary.select>>,
    ): IChatting.IResponse {
      return {
        created_at: input.created_at.toISOString(),
        id: input.id,
        message: input.message,
        room_id: input.room_id,
        speaker: input.speaker,
      };
    }

    export function select() {
      return {
        select: {
          id: true,
          room_id: true,
          user_id: true,
          speaker: true,
          message: true,
          created_at: true,
          deleted_at: true,
        },
      } satisfies Prisma.chattingFindManyArgs;
    }
  }

  export function collect(input: IChatting.ICreateInput) {
    return {
      user_id: input.userId,
      room_id: input.roomId,
      speaker: input.speaker,
      message: input.message,
    };
  }

  export async function create(input: IChatting.ICreateInput) {
    const chat = await prisma.chatting.create({
      ...ChatProvider.summary.select(),
      data: {
        id: randomUUID(),
        created_at: new Date().toISOString(),
        ...ChatProvider.collect(input),
      },
    });

    return ChatProvider.summary.transform(chat);
  }
}
