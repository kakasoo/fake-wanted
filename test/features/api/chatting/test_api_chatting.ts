import api from "@kakasoo/fake-wanted-api/lib/index";

import { IListener } from "../../../../src/controllers/chatting/ChattingController";

export const test_api_calculate_start = async (connection: api.IConnection): Promise<void> => {
  const stack: IListener.IEvent[] = [];
  const listener: IListener = {
    on: (event) => stack.push(event),
  };
  const { connector, driver } = await api.functional.chatting.start(connection, listener);

  await driver.send({ message: "", histories: [] });

  try {
  } catch (exp) {
    throw exp;
  } finally {
    await connector.close();
  }
};
