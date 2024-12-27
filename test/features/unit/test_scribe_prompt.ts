import { randomUUID } from "crypto";
import typia from "typia";

import { IAgent } from "@kakasoo/fake-wanted-api/lib/structures/agent/IAgent";

import { Scribe } from "../../../src/agent/scribe/scribe";
import { RoomProvider } from "../../../src/providers/room/RoomProvider";

export async function test_scribe_prompt(): Promise<void> {
  type Type = Awaited<ReturnType<ReturnType<typeof RoomProvider.at>>>["chattings"] & typia.tags.MinItems<100>;
  const chattings = typia.random<Type>();

  const response = Scribe.prompt(
    {
      id: randomUUID(),
      user_id: randomUUID(),
      chattings: chattings.map((el) => {
        return { ...el, speaker: "system", role: typia.random<Exclude<IAgent.Role, null>>() };
      }),
      created_at: new Date().toISOString(),
    },
    ["fillArgument", "selectFunction", "opener"],
  );

  console.log(JSON.stringify(response, null, 2));

  typia.assert(response);
}
