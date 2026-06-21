import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import Handlebars from "handlebars";
import { decode } from "html-entities";
import { nodeStatusChannel } from "@/inngest/channels/node-status";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);

  return safeString;
});

type SlackData = {
  variableName?: string;
  webhookUrl?: string;
  content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    nodeStatusChannel().status({
      nodeId,
      status: "loading",
    }),
  );

  if (!data.webhookUrl) {
    await publish(
      nodeStatusChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Slack Node : Webhook URL is missing");
  }

  if (!data.content) {
    await publish(
      nodeStatusChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Slack Node : Content is missing");
  }

  const rawContent = Handlebars.compile(data.content)(context);
  const content = decode(rawContent);

  try {
    const result = await step.run("slack-webhook", async () => {
      if (!data.variableName) {
        await publish(
          nodeStatusChannel().status({
            nodeId,
            status: "error",
          }),
        );
        throw new NonRetriableError("Slack Node : Variable name is missing");
      }
      await ky.post(data.webhookUrl!, {
        json: {
          content: content,
        },
      });

      return {
        ...context,
        [data.variableName]: {
          messageContent: content.slice(0, 2000),
        },
      };
    });

    await publish(
      nodeStatusChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    await publish(
      nodeStatusChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
