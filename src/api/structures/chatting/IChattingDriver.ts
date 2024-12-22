import { IListener } from "./IListener";

export interface IChattingDriver {
  send: (input: IChattingDriver.ISendInput) => any;
}

export namespace IChattingDriver {
  export interface ISendInput {
    message: string;
    histories: IListener.IEvent[];
  }
}
