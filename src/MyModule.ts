import { Module } from "@nestjs/common";

import { ChattingModule } from "./controllers/chatting/ChattingModule";
import { MonitorModule } from "./controllers/monitors/MonitorModule";
import { WantedModule } from "./controllers/wanted/WantedModule";

@Module({
  imports: [MonitorModule, WantedModule, ChattingModule],
})
export class MyModule {}
