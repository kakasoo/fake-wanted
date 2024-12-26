import axios from "axios";

import { IWanted } from "@kakasoo/fake-wanted-api/lib/structures/watned/IWanted";

export namespace WantedProvider {
  export async function search(input: IWanted.ISearchInput): Promise<IWanted.ISearchOutput> {
    const baseUrl = `https://www.wanted.co.kr/api/chaos/search/v1/autocomplete?=&query=${input.query}`;
    const response = await axios(baseUrl);
    return response.data;
  }
}
