import core, { HumanRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { UserProvider } from "../../providers/user/UserProvider";

@Controller("user")
export class UserController {
  @HumanRoute()
  @core.TypedRoute.Post()
  async create(): Promise<IEntity> {
    return UserProvider.create();
  }
}
