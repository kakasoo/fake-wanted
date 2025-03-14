import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { prisma } from "../common/PrismaProvider";
import { RoomProvider } from "./RoomProvider";

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
      id: randomUUID(),
      user_id: input.userId,
      room_id: input.roomId,
      speaker: input.speaker,
      role: input.role,
      message: input.message,
      created_at: new Date().toISOString(),
    } satisfies Prisma.chattingCreateManyInput;
  }

  export async function create(input: IChatting.ICreateInput) {
    // 1. Room이 없을 경우를 대비해, 채팅 시작 시 Room 생성 로직을 추가
    await RoomProvider.findOneOrCreate({ id: input.userId })({ id: input.roomId });

    // 2. Chat을 생성
    const chat = await prisma.chatting.create({
      ...ChatProvider.summary.select(),
      data: ChatProvider.collect(input),
    });

    return ChatProvider.summary.transform(chat);
  }
}
