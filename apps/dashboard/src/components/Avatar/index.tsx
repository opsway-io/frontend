import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
  Skeleton,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { stringToInitials } from "../../utilities/names";

interface AvatarProps extends MuiAvatarProps {
  name?: string;
  loading?: boolean;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  loading,
  name,
  ...props
}) => {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (props.src) {
      setLoaded(false);
      const img = new Image();
      img.src = props.src;
      img.onload = () => {
        setLoaded(true);
      };
    }
  }, [props.src]);

  return (
    <>
      <Skeleton
        variant="rectangular"
        sx={{
          display: !loaded || loading ? "inherit" : "none",
          borderRadius: (t) => `${t.shape.borderRadius}px`,
        }}
      >
        {/* used for Inferring dimensions */}
        <MuiAvatar {...props} src={undefined} />
      </Skeleton>

      <MuiAvatar
        {...props}
        sx={{
          ...props.sx,
          display: loaded && !loading ? "inherit" : "none",
        }}
      >
        {name ? stringToInitials(name) : props.children}
      </MuiAvatar>
    </>
  );
};

export default Avatar;
