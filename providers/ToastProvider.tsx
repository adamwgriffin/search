"use client";

import AppToast from "../components/AppToast/AppToast";

type ToastProviderProps = {
  children: React.ReactNode;
};

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <AppToast />
    </>
  );
}
