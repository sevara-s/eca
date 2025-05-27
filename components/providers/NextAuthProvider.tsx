"use client"
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ChildrenType {
  children: React.ReactNode;
}
const queryClient = new QueryClient();
const NextAuthProvider = ({ children }: ChildrenType) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default NextAuthProvider;
