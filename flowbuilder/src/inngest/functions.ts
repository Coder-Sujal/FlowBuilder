import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("fetching", "5s");

    await step.sleep("transcribing", "5s");

    await step.sleep("sending-to-ai", "5s");

    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }
);

export const sendChatWithAi = inngest.createFunction(
  { id: "chat-with-ai" },
  { event: "test/chat.ai" },
  async ({ step }) => {
    const { steps: geminiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful ai assistant",
        prompt: "What is 2 + 2 ?",
      }
    );

    const { steps: openaiSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: openai("gpt-4.1-nano"),
        system: "You are a helpful ai assistant",
        prompt: "What is 2 + 2 ?",
      }
    );

    const { steps: anthropicSteps } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: anthropic("claude-sonnet-4-5"),
        system: "You are a helpful ai assistant",
        prompt: "What is 2 + 2 ?",
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    };
  }
);
