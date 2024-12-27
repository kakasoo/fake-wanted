import { randomUUID } from "crypto";
import typia from "typia";

import api from "@kakasoo/fake-wanted-api";

import { RunFunctionAgent } from "../../../../src/agent/runFunction/runFunction";
import { ChatProvider } from "../../../../src/providers/room/ChatProvider";
import { RoomProvider } from "../../../../src/providers/room/RoomProvider";

export async function test_api_chatting_run_function_chat(): Promise<void> {
  const user = await api.functional.user.create({ host: "http://localhost:37001" });
  const roomId = randomUUID();
  await ChatProvider.create({
    userId: user.id,
    roomId: roomId,
    speaker: "system",
    message: [
      "The server called the function on behalf of LLM.",
      "Please explain to the user based on this response.",
      "The below code is result of a function response called by the server on behalf of LLM.",
      "<RESPONSE>",
      JSON.stringify(
        {
          user_recent_search_keyword: null,
          keywords: [],
          company_tags: [],
          companies: [
            {
              application_response_stats: null,
              kreditjob_id: null,
              id: 42204,
              logo_img: {
                origin: "https://static.wanted.co.kr/images/wdes/0_4.ec01e476.png",
                thumb: "https://static.wanted.co.kr/images/wdes/0_5.ec01e476.png",
              },
              title_img: {
                origin: "https://static.wanted.co.kr/images/company/42204/2hdp0rmchqc26e58__1080_790.jpg",
                thumb: "https://static.wanted.co.kr/images/company/42204/2hdp0rmchqc26e58__400_400.jpg",
                video: null,
              },
              name: "뤼튼테크놀로지스",
              company_tags: [
                { tag_type_id: null, title: "IT, 컨텐츠", kind_title: "7" },
                { tag_type_id: null, title: "스타트업", kind_title: "6" },
                { tag_type_id: null, title: "연봉상위11~20%", kind_title: "6" },
                { tag_type_id: null, title: "인원급성장", kind_title: "6" },
                { tag_type_id: null, title: "51~300명", kind_title: "6" },
                { tag_type_id: null, title: "식비", kind_title: "6" },
                { tag_type_id: null, title: "설립3년이하", kind_title: "6" },
                { tag_type_id: null, title: "퇴사율5%이하", kind_title: "6" },
                { tag_type_id: null, title: "인공지능", kind_title: "6" },
                { tag_type_id: null, title: "택시비", kind_title: "6" },
              ],
              attraction_tags: [10401, 10403, 10468, 10437, 10407, 10485, 10398],
            },
          ],
          category_tags: [],
        },
        null,
        2,
      ),
      "</RESPONSE>",
    ].join("\n"),
    role: "called",
  });

  const room = await RoomProvider.at(user)({ id: roomId });
  const response = await RunFunctionAgent.chat(room)();
  typia.assert(response);
}
