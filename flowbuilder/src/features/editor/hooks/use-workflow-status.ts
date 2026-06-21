import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { useInngestSubscription } from "@inngest/realtime/hooks";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";
import { NODE_STATUS_CHANNEL_NAME } from "@/inngest/channels/node-status";
import { nodeStatusesAtom } from "../store/atoms";
import { fetchNodeStatusToken } from "../actions";

/**
 * Opens a single realtime subscription for the whole editor and fans the
 * incoming node statuses out into `nodeStatusesAtom`, keyed by nodeId. This
 * replaces the previous per-node subscriptions, which raced to connect on
 * production and dropped early/intermediate messages.
 */
export function useWorkflowStatus() {
  const setStatuses = useSetAtom(nodeStatusesAtom);

  const { data } = useInngestSubscription({
    refreshToken: fetchNodeStatusToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    const next: Record<string, NodeStatus> = {};

    for (const msg of data) {
      if (
        msg.kind === "data" &&
        msg.channel === NODE_STATUS_CHANNEL_NAME &&
        msg.topic === "status"
      ) {
        next[msg.data.nodeId] = msg.data.status as NodeStatus;
      }
    }

    setStatuses(next);
  }, [data, setStatuses]);
}
