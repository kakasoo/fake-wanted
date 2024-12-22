import { tags } from "typia";

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
