import type { IconType } from "react-icons";
import ContainedButton from "../../design_system/ContainedButton/ContainedButton";
import styles from "./LoginButton.module.css";

export interface LoginButtonProps {
  icon: IconType;
  label: string;
  onClick?: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  icon: Icon,
  label,
  onClick
}) => {
  return (
    <ContainedButton
      onClick={onClick}
      textColor="var(--foreground)"
      backgroundColor="var(--background-secondary)"
    >
      <div className={styles.content}>
        <Icon size={24} /> {label}
      </div>
    </ContainedButton>
  );
};

export default LoginButton;
