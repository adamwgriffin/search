import { Suspense } from "react";
import LoginOrRegisterForm from "../../components/form/LoginOrRegisterForm/LoginOrRegisterForm";
import styles from "./login.module.css";

function LoginOrRegisterFormFallback() {
  return <></>;
}

const Login: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.login}>
        <header className={styles.header}>
          <h1 className={styles.heading}>Login or Sign Up</h1>
        </header>
        <div className={styles.formContainer}>
          <Suspense fallback={<LoginOrRegisterFormFallback />}>
            <LoginOrRegisterForm useCallbackUrl />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Login;
