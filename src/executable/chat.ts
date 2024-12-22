import * as readline from "readline";

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
  let input = "";
  while (true) {
    input = await askQuestion("문장을 입력하세요 (줄바꿈은 Shift+Enter로 가능, 종료하려면 Ctrl+C): ");
    const inputBuffer = input + "\n"; // 줄바꿈과 함께 입력 내용 누적

    // 현재까지 입력한 내용 출력
    console.log(`User: ${inputBuffer}`);
  }
}

main().catch(console.error);
