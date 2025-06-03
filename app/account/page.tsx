import MinimalHeader from "../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../components/AccountBody/AccountBody";
import MyAccount from "../../containers/MyAccount/MyAccount";

export default function Account() {
  return (
    <>
      <MinimalHeader />
      <AccountBody>
        <h1>My Account</h1>
        <MyAccount />
      </AccountBody>
    </>
  );
}
