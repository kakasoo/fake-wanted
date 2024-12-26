import { WebSocketAdaptor } from "@nestia/core";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { MyConfiguration } from "./MyConfiguration";
import { MyModule } from "./MyModule";
import { HttpExceptionFilter } from "./filters/all-exception.filter";

export class MyBackend {
  private application_?: INestApplication;

  public async open(): Promise<void> {
    // MOUNT CONTROLLERS
    this.application_ = await NestFactory.create(MyModule, {});

    // WEBSOCKET
    await WebSocketAdaptor.upgrade(this.application_);

    // DO OPEN
    this.application_.enableCors();
    this.application_.useGlobalFilters(new HttpExceptionFilter());
    await this.application_.listen(MyConfiguration.API_PORT(), "0.0.0.0");
  }

  public async close(): Promise<void> {
    if (this.application_ === undefined) return;

    // DO CLOSE
    await this.application_.close();
    delete this.application_;
  }
}
