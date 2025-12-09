"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Logout from "./Logout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Page = () => {
  // await requireAuth();

  const trpc = useTRPC();
  // const queryClient = useQueryClient();
  // const { data: workflow } = useQuery(trpc.getWorkflows.queryOptions());
  const create = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: () => {
        toast.success("Job queued");
      },
    })
  );

  const createText = useMutation(trpc.testAi.mutationOptions({
    onSuccess: () => {
      toast.success("Ai job queued")
    }
  }))

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-6">
      <span>Proptected Component</span>
      <div className="w-72">{JSON.stringify(createText.data)}</div>
      <Button disabled={createText.isPending} onClick={() => createText.mutate()}>Test Ai</Button>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>
        Create workflow
      </Button>
      <Logout />
    </div>
  );
};

export default Page;
