import { TypedBody } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IEntity } from "@kakasoo/fake-wanted-api/lib/structures/common/IEntity";

import { AnswerAgent } from "../../agent/answer";
import { Actor } from "../../decorators/Actor";

@Controller("chatting")
export class ChattingController {
  async chat(@Actor() user: IEntity, @TypedBody() input: IChatting.IChatInput) {
    return AnswerAgent.send(user)(input);
  }
}
