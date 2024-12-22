import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Singleton } from "tstl";

import { IEntity } from "../api/structures/common/IEntity";

export const Actor =
  (): ParameterDecorator =>
  (target: object, propertyKey: string | symbol | undefined, parameterIndex: number): void => {
    singleton.get()(target, propertyKey, parameterIndex);
  };

const singleton = new Singleton(() =>
  createParamDecorator(async (_0: any, ctx: ExecutionContext): Promise<IEntity> => {
    const headers = ctx.switchToHttp().getRequest().headers satisfies Headers;
    const user_id = headers["authorization"];
    return { id: user_id };
  })(),
);
