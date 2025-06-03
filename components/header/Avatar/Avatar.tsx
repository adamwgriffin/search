"use client";

import Image from "next/image";
import NoUserImageIcon from "../../design_system/icons/NoUserImageIcon/NoUserImageIcon";
import styles from "./Avatar.module.css";

interface AvatarProps {
  src: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ src }) => {
  return (
    <>
      {src ? (
        <Image
          className={styles.avatarImage}
          height="30"
          width="30"
          alt="Avatar"
          src={src}
        />
      ) : (
        <div className={styles.noImage}>
          <NoUserImageIcon />
        </div>
      )}
    </>
  );
};

export default Avatar;
