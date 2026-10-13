import {
  Avatar as JoyAvatar,
  AvatarProps as JoyAvatarProps,
  Skeleton,
} from "@mui/joy";
import { FunctionComponent, useEffect, useState } from "react";
import { stringToInitials } from "../../utilities/names";

interface AvatarProps extends JoyAvatarProps {
  name?: string;
  loading?: boolean;
}

/** Preloads `src` and reports which source has finished loading (or failed). */
const useSettledImageSource = (src?: string) => {
  const [settledSrc, setSettledSrc] = useState<string>();

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    const settle = () => setSettledSrc(src);
    image.addEventListener("load", settle);
    image.addEventListener("error", settle);
    image.src = src;

    return () => {
      image.removeEventListener("load", settle);
      image.removeEventListener("error", settle);
    };
  }, [src]);

  return !src || settledSrc === src;
};

const Avatar: FunctionComponent<AvatarProps> = ({
  loading,
  name,
  ...props
}) => {
  const loaded = useSettledImageSource(props.src);

  return (
    <JoyAvatar
      size="sm"
      {...props}
      src={loaded ? props.src : undefined}
      sx={{ flexShrink: 0, ...props.sx }}
    >
      <Skeleton loading={!loaded || !!loading} animation="wave" />
      {name ? stringToInitials(name) : props.children}
    </JoyAvatar>
  );
};

export default Avatar;
