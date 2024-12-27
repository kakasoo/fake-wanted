import { RandomGenerator } from "@nestia/e2e";
import { randomUUID } from "crypto";
import { writeFileSync } from "fs";
import path from "path";
import * as readline from "readline";

import * as apis from "../api/functional";
import { IChatting } from "../api/structures/chatting/IChatting";
import { IEntity } from "../api/structures/common/IEntity";
import { RoomProvider } from "../providers/room/RoomProvider";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// 문장을 입력받는 부분
const askQuestion = (prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

let user: IEntity | null;
let roomId: string;

async function main() {
  user = await apis.user.create({ host: "http://localhost:37001" });
  roomId = randomUUID();

  if (user !== null) {
    let input = "";
    while (true) {
      input = await askQuestion("문장을 입력하세요 (줄바꿈은 Shift+Enter로 가능, 종료하려면 Ctrl+C): ");
      const inputBuffer = input + "\n"; // 줄바꿈과 함께 입력 내용 누적

      // 현재까지 입력한 내용 출력
      console.log(`User: ${inputBuffer}`);

      // LLM 답변
      const answers = await apis.chatting.chat(
        {
          host: "http://localhost:37001",
          headers: {
            Authorization: user.id,
          },
        },
        {
          roomId: roomId,
          message: inputBuffer,
        },
      );

      answers?.forEach((answer: IChatting.IResponse) => {
        console.log(`Agent: ${answer.message}`);
      });
    }
  }
}

main().catch(async (err) => {
  // 1. 에러 로그 남기기
  console.error(err);

  if (user !== null) {
    const code = RandomGenerator.alphaNumeric(4);
    const room = await RoomProvider.at(user)({ id: roomId });
    writeFileSync(path.join(__dirname, `../../test/errorCase/${code}.json`), JSON.stringify(room, null, 2));
  }
});
