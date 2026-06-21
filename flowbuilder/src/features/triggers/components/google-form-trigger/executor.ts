import type { NodeExecutor } from "@/features/executions/types";
import { nodeStatusChannel } from "@/inngest/channels/node-status";

type GoogleFormTriggerData = Record<string, unknown>;

export const googleFormTriggerExecutor: NodeExecutor<GoogleFormTriggerData> = async ({
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

  const result = await step.run("google-form-trigger", async () => context);

  await publish(
    nodeStatusChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
