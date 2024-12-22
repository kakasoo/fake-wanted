import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import OpenAI from "openai";
import { join } from "path";
import { Driver } from "tgrid";
import typia from "typia";

import { IChattingDriver } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IChattingDriver";
import { IListener } from "@kakasoo/fake-wanted-api/lib/structures/chatting/IListener";

import { MyConfiguration } from "../../../MyConfiguration";
import { createQueryParameter } from "../../../utils/createQueryParameter";
import { MessageType } from "./messageType";

export namespace AnswerAgent {
  async function generate(input: IChattingDriver.ISendInput, additionalPrompt?: string[]) {
    return await new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    }).chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: [
            "This schema information is information about external APIs that you can call.",
            "You have to find function that the user requires here.",
            "If you find a function, you must define the input parameters for executing it.",
            "[Caution] From here down is the schema.",
            `${getSchemaInfo()}`,
            "[Caution] From here, the top is the schema.",
            "",
            "All chats with users are talked through the markdown viewer, so you always have to say markdown.",
            "",
            "Your response format is always one of them:",
            '1. `{ "type": "chat", "message": string }`',
            '2. `{ "type": "selectFunction", "functions": Array<{ method: "get" | "post" | "delete" | "put" | "patch", pathname: string }>, "message": string }`',
            '3. `{ "type": "fillArgument", "method": "get" | "post" | "delete" | "put" | "patch", pathname: string, "parameters": JSON, "message": string }`',
            "",
            "'fillArgument' is JSON, and each JSON object should be mapped under the fki names 'query', 'body', and 'param'.",
            'for example, { "parameters": { "body": { "query": "EXAMPLE_TEXT" } } }',
            "[Caution] All message types must adhere to the JSON format.",
            "'chat' is just sending message as markdown format.",
            "'selectFunction' is selecting method and method property must be method name like as get, post, delete, put, patch, and pathname, for example, 'monitors/health'",
            "'fillArguments' is to listen to the user and directly fill the factor values to fill the function.",
            "If it is not enough to fill yet, you should ask the user to secure the factor, and this question corresponds to the 'chat' type.",
            "'fillArguments' must not appear before 'selectFunction'.",
            "'fillArguments' must be an extension of the type of 'selectFunction' because it fills the parameters.",
            "",
            "You have to finally get to the stage of calling the function, so you have to talk to the user and finally go to 'fillArguments' three times.",
            "If you explain this response to the user, the user will decide whether to call the function or not.",
            "",
            "[ADDITIONAL_PROMPT]",
            `${additionalPrompt?.join("\n")}`, // result of function calling
          ].join("\n"),
        },
        {
          role: "assistant",
          content: [
            "This is what I have talked to the user so far.",
            `${JSON.stringify(input.histories, null, 2)}`,
          ].join("\n"),
        },
        {
          role: "user",
          content: input.message,
        },
      ],
    });
  }

  function getSchemaInfo(): string {
    const filepath = join(__dirname, "../../../../packages/api/openai-positional.json");

    const schema = readFileSync(filepath, { encoding: "utf-8" });
    return schema;
  }

  function getContent(input: OpenAI.Chat.Completions.ChatCompletion) {
    const token = input.choices.at(0)?.message.content ?? "{}";
    return token;
  }

  export async function answer(listener: Driver<IListener>, input: IChattingDriver.ISendInput) {
    const stream = await generate(input);
    const token = getContent(stream);
    const parsed = JSON.parse(token);
    const isFillArgument = typia.is<MessageType.FillArgument>(parsed);
    listener
      .on({
        speaker: "agent",
        type: "chat",
        token: token,
        createdAt: new Date().toISOString(),
        messageId: randomUUID(),
      })
      .catch(console.error);

    if (isFillArgument) {
      console.log("isFillArgument: ", isFillArgument);
      const queryParameter = createQueryParameter(parsed.parameters.query ?? {});
      const response = await fetch(
        `http://localhost:${MyConfiguration.API_PORT()}${parsed.pathname}?${queryParameter}`,
        {
          method: parsed.method,
          ...((parsed.method === "get" ? {} : { body: parsed.parameters.body ? parsed.parameters.body : {} }) as any),
        },
      );
      parsed.pathname.split("/");
      const functionCalling = await response.json();
      const result = await generate(input, [
        "This is result of function calling:",
        JSON.stringify(functionCalling, null, 2),
        "Answer the user by referring to the result of this function call.",
        "In this case, the only message type available to the user is 'chat'.",
      ]);

      listener
        .on({
          speaker: "agent",
          type: "chat",
          token: getContent(result),
          createdAt: new Date().toISOString(),
          messageId: randomUUID(),
        })
        .catch(console.error);
    } else {
    }

    // new ReadableStream({
    //   async start(controller) {
    //     for await (const chunk of stream) {
    //       const output = chunk.choices.at(0)?.delta.content ?? "";
    //       listener
    //         .on({ type: "chat", token: `${output}` })
    //         .catch(console.error);
    //     }

    //     listener.on({ type: "endResponse", messageId }).catch(console.error);
    //     controller.close();
    //   },
    // });
  }
}
