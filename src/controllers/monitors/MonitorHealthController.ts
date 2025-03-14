import core, { HumanRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";

@Controller("monitors/health")
export class MonitorHealthController {
  /**
   * Health check API.
   *
   * @tag Monitor
   *
   * @author Samchon
   */
  @HumanRoute()
  @core.TypedRoute.Get()
  public get(): void {}
}
