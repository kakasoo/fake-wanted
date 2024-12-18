import { Module } from "@nestjs/common";

import { MonitorModule } from "./controllers/monitors/MonitorModule";
import { WantedModule } from "./controllers/wanted/WantedModule";

@Module({
  imports: [MonitorModule, WantedModule],
})
export class MyModule {}
