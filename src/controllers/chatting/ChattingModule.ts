import { Module } from "@nestjs/common";

import { ChattingController } from "./ChattingController";

@Module({
  controllers: [ChattingController],
  providers: [],
})
export class ChattingModule {}
