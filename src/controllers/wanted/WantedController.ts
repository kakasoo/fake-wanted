import core, { TypedQuery } from "@nestia/core";
import { Controller } from "@nestjs/common";

import { IWanted } from "@kakasoo/fake-wanted-api/lib/structures/watned/IWanted";

import { WantedProvider } from "../../providers/wanted/WantedProvider";

@Controller("wanted")
export class WantedController {
  /**
   * Wanted is a site that collects employment
   * information in Korea. This API exists to search
   * for companies. You can search for companies by
   * calling this API, and companies that match the
   * query delivered by the factor will come out in
   * order of similarity. You may want to call this
   * function first to see additional information
   * about the company.
   *
   * @summary Search Companies
   * @param input Search company parameters in `Wanted`
   * @returns Companies matched inqueries
   */
  @core.TypedRoute.Get()
  async search(@TypedQuery() input: IWanted.ISearchInput): Promise<IWanted.ISearchOutput> {
    return WantedProvider.search(input);
  }
}
