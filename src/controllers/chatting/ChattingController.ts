import { WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Driver, WebSocketAcceptor } from "tgrid";

export interface IChatting {
  send: () => any;
}

export class Chatter implements IChatting {
  public constructor(private readonly listener: Driver<IListener>) {
    console.log(this.listener.name);
  }

  send() {}
}

export interface IListener {
  on(event: IListener.IEvent): void;
}

export namespace IListener {
  export interface IEvent {
    type: string;
  }
}

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
    acceptor: WebSocketAcceptor<any, IChatting, IListener>,
    @WebSocketRoute.Driver() driver: Driver<IListener>,
  ): Promise<void> {
    console.log(acceptor);
    console.log(driver);
    await acceptor.accept(new Chatter(driver));
  }
}
