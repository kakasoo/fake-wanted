import { WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { Driver, WebSocketAcceptor } from "tgrid";
import { tags } from "typia";

import { AnswerAgent } from "./agents/answer";

export interface IChattingDriver {
  send: (input: { message: string; histories: IListener.IEvent[] }) => any;
}

export class Chatter implements IChattingDriver {
  public constructor(private readonly listener: Driver<IListener>) {
    console.log("listener: ", this.listener.name);
  }

  async send(input: Parameters<IChattingDriver["send"]>[0]) {
    await AnswerAgent.answer(this.listener, input);
  }
}

export interface IListener {
  on(event: IListener.IEvent): void;
}

export namespace IListener {
  export interface IEvent {
    speaker: "user" | "agent";
    type: "chat";
    token: string;
    messageId: string;
    createdAt: string & tags.Format<"date-time">;
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
    acceptor: WebSocketAcceptor<any, IChattingDriver, IListener>,
    @WebSocketRoute.Driver() driver: Driver<IListener>,
  ): Promise<void> {
    await acceptor.accept(new Chatter(driver));
  }
}
