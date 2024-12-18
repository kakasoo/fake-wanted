import { Module } from "@nestjs/common";

import { WantedController } from "./WantedController";

@Module({
  controllers: [WantedController],
  providers: [],
})
export class WantedModule {}
