import MinimalHeader from "../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../components/AccountBody/AccountBody";
import MyAccount from "../../containers/MyAccount/MyAccount";
import ReactQueryClientProvider from "@/providers/ReactQueryClientProvider";

export default function Account() {
  return (
    <ReactQueryClientProvider>
      <MinimalHeader />
      <AccountBody>
        <h1>My Account</h1>
        <MyAccount />
      </AccountBody>
    </ReactQueryClientProvider>
  );
}
