import { nodeStatusChannel } from "@/inngest/channels/node-status";
import type { NodeExecutor } from "@/features/executions/types";

type StripeTriggerData = Record<string, unknown>;

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async ({
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

  const result = await step.run("stripe-trigger", async () => context);

  await publish(
    nodeStatusChannel().status({
      nodeId,
      status: "success",
    }),
  );

  return result;
};
