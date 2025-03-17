import React, { useState } from "react";
import Image from "next/image";

interface UserImageProps {
  src: string;
  alt: string;
}

const UserImage: React.FC<UserImageProps> = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      width={200}
      height={200}
      alt={alt}
      priority
      onError={() => setImageSrc("/assets/profile-avatar.svg")}
    />
  );
};

export default UserImage; // Make sure this line exists!
