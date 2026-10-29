import AccountBody from "@/components/AccountBody/AccountBody";
import MinimalHeader from "@/components/header/MinimalHeader/MinimalHeader";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export default function AccountLayoutPage({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryClientProvider>
      <MinimalHeader />
      <AccountBody>{children}</AccountBody>
    </ReactQueryClientProvider>
  );
}
