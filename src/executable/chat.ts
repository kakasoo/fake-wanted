import { randomUUID } from "crypto";
import * as readline from "readline";

import * as apis from "../api/functional";

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

async function main() {
  const roomId = randomUUID();
  const user = await apis.user.create({ host: "http://localhost:37001" });

  let input = "";
  while (true) {
    input = await askQuestion("문장을 입력하세요 (줄바꿈은 Shift+Enter로 가능, 종료하려면 Ctrl+C): ");
    const inputBuffer = input + "\n"; // 줄바꿈과 함께 입력 내용 누적

    // 현재까지 입력한 내용 출력
    console.log(`User: ${inputBuffer}`);

    // LLM 답변
    const answer = await apis.chatting.chat(
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

    console.log(`Agent: ${answer?.message}`);
  }
}

main().catch(console.error);
