import { randomUUID } from "crypto";

import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { prisma } from "../common/PrismaProvider";

export namespace UserProvider {
  export async function create() {
    return prisma.user.create({
      data: {
        id: randomUUID(),
        created_at: new Date().toISOString(),
      },
    });
  }

  export async function at(user: IEntity) {
    return prisma.user.findFirstOrThrow({
      where: user,
    });
  }
}
