import { tags } from "typia";

export namespace IWanted {
  export interface ISearchOutput {
    user_recent_search_keyword: any;
    keywords: string[];
    company_tags: string[];
    companies: null | Array<{
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
      name: string;
      application_response_stats: any;
      kreditjob_id: any;
      company_tags: Array<{ tag_type_id: any; title: string; kind_title: `${number}` }>;
      attraction_tags: null | Array<number>;
    }>;
    category_tags: string[];
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
}
