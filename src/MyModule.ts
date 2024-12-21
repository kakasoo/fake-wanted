import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

import { ChattingModule } from "./controllers/chatting/ChattingModule";
import { MonitorModule } from "./controllers/monitors/MonitorModule";
import { WantedModule } from "./controllers/wanted/WantedModule";

@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, "client") }),
    MonitorModule,
    WantedModule,
    ChattingModule,
  ],
})
export class MyModule {}
