import Sidebar from "@/components/dashboard-components/sidebar";
import Header from "@/components/dashboard-components/header";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import "../globals.css";
export const metadata = {
  title: "Dashboard",
};
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
        <div className="flex min-h-screen bg-[#f4f9fd]">
          <div className="fixed h-full z-50">
            <Sidebar />
          </div>
          <div className="flex-1 ml-[200px] min-h-screen">
            <Header />
            <main className="min-h-[calc(100vh-96px)] p-6 bg-[#f4f9fd]">
              <div className="container2">{children}</div>
            </main>
          </div>
        </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
