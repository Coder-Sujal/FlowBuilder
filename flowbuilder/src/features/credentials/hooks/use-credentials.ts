import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
  type UseQueryResult,
  type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma/enums";

type CredentialListItem = {
  id: string;
  name: string;
  type: CredentialType;
  createdAt: Date;
  updatedAt: Date;
};

type CredentialDetail = CredentialListItem & {
  value: string;
  userId: string;
};

type CredentialsListResult = {
  items: CredentialListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const useSuspenseCredentials =
  (): UseSuspenseQueryResult<CredentialsListResult, Error> => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  return useSuspenseQuery(
    trpc.credentials.getMany.queryOptions(params),
  ) as UseSuspenseQueryResult<CredentialsListResult, Error>;
};

export const useCreateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data.name} created`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    }),
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credentials ${data.name} removed`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
      },
    }),
  );
};

export const useSuspenseCredential = (
  id: string,
): UseSuspenseQueryResult<CredentialDetail, Error> => {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.credentials.getOne.queryOptions({ id }),
  ) as UseSuspenseQueryResult<CredentialDetail, Error>;
};

export const useUpdateCredential = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential ${data.name} saved`);
        queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
        );
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    }),
  );
};

export const useCredentialsByType = (
  type: CredentialType,
): UseQueryResult<CredentialDetail[], Error> => {
  const trpc = useTRPC();
  return useQuery(
    trpc.credentials.getByType.queryOptions({ type }),
  ) as UseQueryResult<CredentialDetail[], Error>;
};
