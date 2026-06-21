import { channel, topic } from "@inngest/realtime";

export const NODE_STATUS_CHANNEL_NAME = "node-status";

/**
 * A single, shared channel for every node's execution status. Each browser
 * subscribes to this once (at the editor level) and demultiplexes messages by
 * `nodeId`, instead of opening one fragile per-node subscription. Node ids are
 * globally unique cuids, so a client simply ignores statuses for nodes that
 * aren't on its canvas.
 */
export const nodeStatusChannel = channel(NODE_STATUS_CHANNEL_NAME).addTopic(
  topic("status").type<{
    nodeId: string;
    status: "loading" | "success" | "error";
  }>(),
);
