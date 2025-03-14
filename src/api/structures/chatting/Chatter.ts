import { Driver } from "tgrid";

import { IChattingDriver } from "./IChattingDriver";
import { IListener } from "./IListener";

export class Chatter implements IChattingDriver {
  public constructor(private readonly listener: Driver<IListener>) {
    console.log("listener: ", this.listener.name);
  }

  async send(input: IChattingDriver.ISendInput) {
    console.log(input);
  }
}
