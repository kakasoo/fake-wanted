import { randomUUID } from "crypto";

import { JudgementAgent } from "../../../../src/agent/judgement/judgement";
import { AgentUtil } from "../../../../src/agent/utils";

export async function test_api_chatting_judgement_chat(): Promise<void> {
  const chatCompletion = await JudgementAgent.call({
    id: randomUUID(),
    user_id: randomUUID(),
    chattings: [],
    created_at: new Date().toISOString(),
  });

  console.log(JSON.stringify(chatCompletion, null, 2));

  console.log(AgentUtil.getContent("judgement")(chatCompletion));
}
