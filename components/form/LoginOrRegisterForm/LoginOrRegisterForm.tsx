"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { type SignInOptions, signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";
import LoginButton from "../LoginButton/LoginButton";
import styles from "./LoginOrRegisterForm.module.css";

export interface LoginOrRegisterFormProps {
  onFormSuccess?: () => void;
  useCallbackUrl?: boolean;
}

const LoginOrRegisterForm: React.FC<LoginOrRegisterFormProps> = ({
  onFormSuccess,
  useCallbackUrl = false
}) => {
  const searchParams = useSearchParams();

  const handleSignIn = useCallback(
    async (signInType: string) => {
      let signInOptions: SignInOptions = {};
      if (useCallbackUrl) {
        signInOptions.callbackUrl = searchParams?.get("callbackUrl") || "/";
      }
      await signIn(signInType, signInOptions);
      onFormSuccess?.();
      toast("You're logged in");
    },
    [onFormSuccess, searchParams, useCallbackUrl]
  );

  return (
    <>
      <div>Login with</div>
      <div className={styles.loginButtons}>
        <LoginButton
          icon={FcGoogle}
          label="Google"
          onClick={() => handleSignIn("google")}
        />
        <LoginButton
          icon={AiFillGithub}
          label="Github"
          onClick={() => handleSignIn("github")}
        />
      </div>
    </>
  );
};

export default LoginOrRegisterForm;
