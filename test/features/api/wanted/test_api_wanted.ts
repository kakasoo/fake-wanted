import typia from "typia";

import api from "@kakasoo/fake-wanted-api";

import { RunFunctionAgent } from "../../../../src/agent/runFunction/runFunction";

export async function test_api_wanted(connection: api.IConnection): Promise<void> {
  const res = await api.functional.wanted.search(connection, {
    query: "뤼튼",
  });

  typia.assert(res);
}

export async function test_api_wanted_with_fill_argument() {
  const fillArgument = {
    type: "fillArgument",
    method: "get",
    pathname: "/wanted",
    parameters: {
      query: { query: "원티드" },
      body: {},
      param: {},
    },
    message: "",
  } as const;

  const response = await RunFunctionAgent.functionCall(fillArgument);
  console.log(response);
}
