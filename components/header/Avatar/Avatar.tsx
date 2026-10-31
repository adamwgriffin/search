"use client";

import Image from "next/image";
import NoUserImageIcon from "@/components/design_system/icons/NoUserImageIcon/NoUserImageIcon";
import styles from "./Avatar.module.css";

export type AvatarProps = Pick<
  React.ComponentProps<typeof Image>,
  "src" | "width" | "height" | "className"
> & {
  alt?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  width = 30,
  height = 30,
  alt = "User image",
  className = styles.avatarImage
}) => {
  if (src) {
    return (
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        className={className}
      />
    );
  }

  return <NoUserImageIcon width={width} height={height} />;
};

export default Avatar;
