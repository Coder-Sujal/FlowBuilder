import { useTRPC } from "@/trpc/client";
import {
  useSuspenseQuery,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { ExecutionStatus } from "@/generated/prisma/enums";
import { useExecutionsParams } from "./use-executions-params";

type ExecutionWithWorkflow = {
  id: string;
  workflowId: string;
  workflow: {
    id: string;
    name: string;
  };
  status: ExecutionStatus;
  startedAt: Date;
  completedAt: Date | null;
  inngestEventId: string;
  output: unknown;
  error: string | null;
  errorStack: string | null;
};

type ExecutionsListResult = {
  items: ExecutionWithWorkflow[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const useSuspenseExecutions =
  (): UseSuspenseQueryResult<ExecutionsListResult, Error> => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();
  return useSuspenseQuery(
    trpc.executions.getMany.queryOptions(params),
  ) as unknown as UseSuspenseQueryResult<ExecutionsListResult, Error>;
};

export const useSuspenseExecution = (
  id: string,
): UseSuspenseQueryResult<ExecutionWithWorkflow, Error> => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.executions.getOne.queryOptions({ id }),
  ) as unknown as UseSuspenseQueryResult<ExecutionWithWorkflow, Error>;
};
