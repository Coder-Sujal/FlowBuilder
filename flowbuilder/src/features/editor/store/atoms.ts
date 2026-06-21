import type { ReactFlowInstance } from "@xyflow/react";
import { atom } from "jotai";

import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

export const editorAtom = atom<ReactFlowInstance | null>(null);

/**
 * Live execution status for every node in the open workflow, keyed by nodeId.
 * Written by the single editor-level realtime subscription; read by each node.
 */
export const nodeStatusesAtom = atom<Record<string, NodeStatus>>({});
