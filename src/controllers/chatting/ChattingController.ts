import { WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Driver, WebSocketAcceptor } from "tgrid";

import { Chatter } from "@kakasoo/fake-wanted-api/lib/structures/chatting/Chatter";
import { IChattingDriver } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChattingDriver";
import { IListener } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IListener";

@Controller("chatting")
export class ChattingController {
  /**
   * Start simple chatting.
   *
   * Start simple chatting through WebSocket.
   */
  @WebSocketRoute("start")
  public async start(
    @WebSocketRoute.Acceptor()
    acceptor: WebSocketAcceptor<any, IChattingDriver, IListener>,
    @WebSocketRoute.Driver() driver: Driver<IListener>,
  ): Promise<void> {
    await acceptor.accept(new Chatter(driver));
  }
}
