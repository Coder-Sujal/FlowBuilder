import { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { Realtime } from "@inngest/realtime";
import { useAtomValue } from "jotai";

import { nodeStatusesAtom } from "@/features/editor/store/atoms";

interface NodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

/**
 * Reads a node's live status from `nodeStatusesAtom`, which is populated by the
 * single editor-level realtime subscription (see `useWorkflowStatus`).
 *
 * The `channel` / `topic` / `refreshToken` fields are accepted for backwards
 * compatibility with existing call sites but are no longer used — every node
 * now shares one subscription rather than opening its own.
 */
export function useNodeStatus({ nodeId }: NodeStatusOptions): NodeStatus {
  const statuses = useAtomValue(nodeStatusesAtom);
  return statuses[nodeId] ?? "initial";
}
