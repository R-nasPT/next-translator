import AuthLayout from "./AuthLayout";
import MainLayout from "./MainLayout";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthLayout>
      <MainLayout>
        {children}
      </MainLayout>
    </AuthLayout>
  );
}
