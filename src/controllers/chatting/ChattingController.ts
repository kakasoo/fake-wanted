import { WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";
import { Driver, WebSocketAcceptor } from "tgrid";

export interface IChattingDriver {
  send: (message: string) => any;
}

export class Chatter implements IChattingDriver {
  public constructor(private readonly listener: Driver<IListener>) {
    console.log("listener: ", this.listener.name);
  }

  private getSchemaInfo(): string {
    const filepath = join(
      __dirname,
      "../../../packages/api/openai-positional.json",
    );

    const schema = readFileSync(filepath, { encoding: "utf-8" });
    return schema;
  }

  async send(message: string) {
    const messageId = randomUUID();
    const listener = this.listener;
    await listener.on({ type: "startResponse", messageId });
    const stream = await new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            "This schema information is information about external APIs that you can call.",
            "You have to find function that the user requires here.",
            "If you find a function, you must define the input parameters for executing it.",
            "[Caution] From here down is the schema.",
            `${this.getSchemaInfo()}`,
            "[Caution] From here, the top is the schema.",
            "",
            "All chats with users are talked through the markdown viewer, so you always have to say markdown.",
          ].join("\n"),
        },
        {
          role: "user",
          content: message,
        },
      ],
      stream: true,
    });

    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const output = chunk.choices.at(0)?.delta.content ?? "";
          listener
            .on({ type: "chat", token: `${output}` })
            .catch(console.error);
        }

        await listener.on({ type: "endResponse", messageId });
        controller.close();
      },
    });
  }
}

export interface IListener {
  on(event: IListener.IEvent): void;
}

export namespace IListener {
  export interface IEvent {
    type: "chat" | "startResponse" | "endResponse";
    token?: string;
    messageId?: string;
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
