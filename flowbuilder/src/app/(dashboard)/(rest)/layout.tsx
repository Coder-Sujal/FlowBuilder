import { AppHeader } from "@/components/app-header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 items-center justify-between">
      <AppHeader />
      {children}
    </main>
  );
};

export default Layout;
