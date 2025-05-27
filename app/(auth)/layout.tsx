import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { Metadata } from "next";
import ToasterProvider from "@/components/providers/ToasterProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "login/register",
  description: "eca login and register",
};
interface ChildrenType {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: ChildrenType) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          {children}

          <ToasterProvider />
        </NextAuthProvider>
      </body>
    </html>
  );
}
