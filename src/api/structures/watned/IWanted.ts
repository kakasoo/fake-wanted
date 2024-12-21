import { tags } from "typia";

export namespace IWanted {
  export interface ISearchOutput {
    user_recent_search_keyword: any;
    keywords: string[];
    company_tags: string[];
    companies: Array<{
      id: number;
      logo_img: {
        origin: string & tags.Format<"uri">;
        thumb: string & tags.Format<"uri">;
      };
      title_img: {
        origin: string & tags.Format<"uri">;
        thumb: string & tags.Format<"uri">;
        video: any;
      };
      name: string;
      application_response_stats: any;
      kreditjob_id: any;
      company_tags: Array<{ tag_type_id: any; title: string; kind_title: `${number}` }>;
      attraction_tags: Array<number>;
    }>;
    category_tags: string[];
  }

  export interface ISearchInput {
    query: string;
  }
}
