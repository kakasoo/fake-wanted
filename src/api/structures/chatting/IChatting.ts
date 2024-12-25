import { tags } from "typia";

import { IAgent } from "../agent/IAgent";

export interface Chatting {
  id: string & tags.Format<"uuid">;
  room_id: string & tags.Format<"uuid">;
  user_id: string & tags.Format<"uuid">;
  speaker: string;
  message: string;
  created_at: string & tags.Format<"date-time">;
  deleted_at: string & tags.Format<"date-time">;
}

export namespace IChatting {
  export interface IChatInput {
    roomId: string;
    message: string;
  }

  export interface ICreateInput extends IChatting.IChatInput {
    userId: string;
    speaker: "system" | "user" | "assistent";
    role: IAgent.Role;
  }

  export interface IResponse extends Pick<Chatting, "id" | "room_id" | "speaker" | "message" | "created_at"> {}
}
