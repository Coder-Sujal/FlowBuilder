import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import Logout from "./Logout";

const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center gap-6">
      <div>
        Protected Component : {JSON.stringify(data)}
      </div>
      <Logout />
    </div>
  );
};

export default Page;
