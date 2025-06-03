"use client";

import { Toaster } from "react-hot-toast";

type ToastProviderProps = {
  children: React.ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
