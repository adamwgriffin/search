"use client";

import { useGetCurrentUser } from "../../hooks/get_current_user_hook";
import LoadingDots from "../../components/design_system/LoadingDots/LoadingDots";

const MyAccount: React.FC = () => {
  const { data: currentUser, isPending } = useGetCurrentUser();

  if (isPending) {
    return (
      <div>
        <LoadingDots />
      </div>
    );
  }

  return (
    <div>
      <p>Name: {currentUser?.name}</p>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
};

export default MyAccount;
