import typia from "typia";

import api from "@kakasoo/fake-wanted-api";

export async function test_api_wanted(connection: api.IConnection): Promise<void> {
  const res = await api.functional.wanted.search(connection, {
    query: "뤼튼",
  });

  typia.assert(res);
}
