"use server";

import { inngest } from "@/inngest/client";
import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { nodeStatusChannel } from "@/inngest/channels/node-status";

export type NodeStatusToken = Realtime.Token<
  typeof nodeStatusChannel,
  ["status"]
>;

export async function fetchNodeStatusToken(): Promise<NodeStatusToken> {
  const token = await getSubscriptionToken(inngest, {
    channel: nodeStatusChannel(),
    topics: ["status"],
  });

  return token;
}
