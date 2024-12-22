export namespace IChatting {
  export interface IChatInput {
    roomId: string;
    message: string;
  }

  export interface ICreateInput extends IChatting.IChatInput {
    userId: string;
    speaker: "user" | "assistent";
  }
}
