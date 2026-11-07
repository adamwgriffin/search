import type { Metadata } from "next";
import "@/styles/globals.css";
import SessionProvider from "@/providers/SessionProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import ToastProvider from "@/providers/ToastProvider";

export const metadata: Metadata = {
  title: "Awsom",
  description: "Search the most awesome listings in Seattle!"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    // Using suppressHydrationWarning per next-themes docs because next-themes
    // updates <html>, which will always cause a warning
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <ThemeProvider>
            <ToastProvider>{children}</ToastProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
