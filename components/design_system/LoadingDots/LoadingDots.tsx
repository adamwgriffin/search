import type { CSSProperties } from "react";
import styles from "./LoadingDots.module.css";

export type LoadingDotsProps = {
  size?: string;
  gap?: string;
};

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = "1rem",
  gap = "0.3125rem"
}) => {
  const dotStyle: CSSProperties = { width: size, height: size };

  return (
    <div style={{ columnGap: gap }} className={styles.loadingDots}>
      <div style={dotStyle}></div>
      <div style={dotStyle}></div>
      <div style={dotStyle}></div>
    </div>
  );
};

export default LoadingDots;
