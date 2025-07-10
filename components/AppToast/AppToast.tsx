"use client";

import { Toaster, type ToasterProps } from "react-hot-toast";
import styles from "./AppToast.module.css";

export default function AppToast(props: ToasterProps) {
  return (
    <Toaster
      {...props}
      toastOptions={{ ...props.toastOptions, className: styles.toaster }}
    />
  );
}
