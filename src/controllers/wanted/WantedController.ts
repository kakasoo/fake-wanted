import core, { TypedQuery } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IWanted } from "@kakasoo/fake-wanted-api/lib/structures/watned/IWanted";

import { WantedProvider } from "../../providers/wanted/WantedProvider";

@Controller("wanted")
export class WantedController {
  @core.TypedRoute.Get()
  async search(
    @TypedQuery() input: IWanted.ISearchInput,
  ): Promise<IWanted.ISearchOutput> {
    return WantedProvider.search(input);
  }
}
