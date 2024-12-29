import { tags } from "typia";

import { IPage } from "../common/IPage";

export namespace IWanted {
  export interface ISearchOutput {
    /**
     * The list of companies most similar to the search term is viewed.
     *
     * @title List of companies searched
     */
    companies: null | Array<{
      /**
       * @title Company ID
       */
      id: number;
      logo_img: null | {
        origin: string & tags.Format<"uri">;
        thumb: string & tags.Format<"uri">;
      };
      title_img: null | {
        origin: string & tags.Format<"uri">;
        thumb: string & tags.Format<"uri">;
        video: (string & tags.Format<"uri">) | null;
      };

      /**
       * @title Company Name
       */
      name: string;

      /**
       * @title Tags of Company
       */
      company_tags: Array<{ tag_type_id: any; title: string; kind_title: `${number}` }>;
    }>;
  }

  export interface ISearchInput {
    /**
     * It is recommended to search this parameter in
     * Korean if possible. Don't forget that 'Wanted'
     * is a Korean site.
     *
     * @title Query to search for companies
     */
    query: string;
  }

  export interface Position {
    /**
     * @title Position ID
     */
    id: number;

    /**
     * @title Reward
     */
    reward_total: string;

    /**
     * @title Company Infomation
     */
    company: {
      /**
       * @title Company ID
       */
      id: number;

      /**
       * @title Company Name
       */
      name: string;
    };
    title_img: null | {
      origin: string & tags.Format<"uri">;
      thumb: string & tags.Format<"uri">;
      video: (string & tags.Format<"uri">) | null;
    };

    /**
     * Position property is title of this JD. i.e. "Back-end Developer(5년이상)"
     * @title Position
     */
    position: string;
  }

  export interface IGetPositionInput extends IPage.IRequest {
    /**
     * It is recommended to search this parameter in
     * Korean if possible. Don't forget that 'Wanted'
     * is a Korean site.
     *
     * @title Query to search for position, job description
     */
    query: string;
  }
}
