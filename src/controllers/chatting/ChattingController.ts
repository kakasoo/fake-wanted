import core, { TypedBody } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { JudgmentAgent } from "../../agent/judgement/judgment";
import { Actor } from "../../decorators/Actor";

@Controller("chatting")
export class ChattingController {
  @core.TypedRoute.Post()
  async chat(@Actor() user: IEntity, @TypedBody() input: IChatting.IChatInput): Promise<IChatting.IResponse[] | null> {
    return JudgmentAgent.answer(user)(input);
  }
}
