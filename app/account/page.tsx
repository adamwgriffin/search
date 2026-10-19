import MinimalHeader from "../../components/header/MinimalHeader/MinimalHeader";
import AccountBody from "../../components/AccountBody/AccountBody";
import { getServerSession } from "next-auth/next";
import authOptions from "@/lib/auth_options";

export default async function Account() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <MinimalHeader />
      <AccountBody>
        <h1>My Account</h1>
        <div>
          <p>Name: {session?.user.name}</p>
          <p>Email: {session?.user?.email}</p>
        </div>
      </AccountBody>
    </>
  );
}
