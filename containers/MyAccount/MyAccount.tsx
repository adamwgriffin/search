"use client";

import { useGetCurrentUserIfAuthenticated } from "../../hooks/get_current_user_if_authenticated_hook";
import LoadingDots from "../../components/design_system/LoadingDots/LoadingDots";

const MyAccount: React.FC = () => {
  const currentUser = useGetCurrentUserIfAuthenticated();

  if (!currentUser) {
    return (
      <div>
        <LoadingDots />
      </div>
    );
  }

  return (
    <div>
      <p>Name: {currentUser.name}</p>
      <p>Email: {currentUser.email}</p>
    </div>
  );
};

export default MyAccount;
