import { TypedBody, WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Driver, WebSocketAcceptor } from "tgrid";

import { Chatter } from "@kakasoo/fake-wanted-api/lib/structures/chatting/Chatter";
import { IChatting } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChatting";
import { IChattingDriver } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChattingDriver";
import { IListener } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IListener";

import { AnswerAgent } from "../../agents/answer";

@Controller("chatting")
export class ChattingController {
  async chat(@TypedBody() input: IChatting.IChatInput) {
    return AnswerAgent.send(input);
  }

  /**
   * Start simple chatting.
   *
   * Start simple chatting through WebSocket.
   */
  @WebSocketRoute("start")
  async start(
    @WebSocketRoute.Acceptor()
    acceptor: WebSocketAcceptor<any, IChattingDriver, IListener>,
    @WebSocketRoute.Driver() driver: Driver<IListener>,
  ): Promise<void> {
    await acceptor.accept(new Chatter(driver));
  }
}
