import axios from "axios";

import { IPage } from "@kakasoo/fake-wanted-api/lib/structures/common/IPage";
import { IWanted } from "@kakasoo/fake-wanted-api/lib/structures/watned/IWanted";

import { createQueryParameter } from "../../utils/createQueryParameter";

export namespace WantedProvider {
  export async function search(input: IWanted.ISearchInput): Promise<IWanted.ISearchOutput> {
    const baseUrl = `https://www.wanted.co.kr/api/chaos/search/v1/autocomplete?=&query=${input.query}`;
    const response = await axios(baseUrl);
    return response.data;
  }

  export async function getPosition(input: IWanted.IGetPositionInput): Promise<IPage<IWanted.Position>> {
    input.page = input.page ?? 1;
    input.limit = input.limit ?? 12;
    const queryParameter = createQueryParameter({ ...input });
    const baseUrl = `https://www.wanted.co.kr/api/chaos/search/v1/position?${queryParameter}`;
    const response = await axios(baseUrl);

    return {
      data: response.data.data,
      pagination: {
        current: input.page,
        limit: input.limit,
        pages: parseInt(String(response.data.total_count / input.limit)) + 1,
        records: response.data.total_count,
      },
    };
  }
}
