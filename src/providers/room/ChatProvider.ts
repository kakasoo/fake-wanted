import { randomUUID } from "crypto";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";

import { prisma } from "../common/PrismaProvider";

export namespace ChatProvider {
  export async function create(input: IChatting.ICreateInput) {
    await prisma.chatting.create({
      data: {
        id: randomUUID(),
        room_id: input.roomId,
        user_id: input.userId,
        speaker: input.speaker,
        created_at: new Date().toISOString(),
      },
    });
  }
}
