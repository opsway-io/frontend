import { Avatar as MuiAvatar, AvatarProps, Skeleton } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";

const Avatar: FunctionComponent<AvatarProps> = (props) => {
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
                variant="circular"
                sx={{
                    display: !loaded ? "inherit" : "none",
                }}

            >
                {/* used for Inferring dimensions */}
                <MuiAvatar {...props} src={undefined} />
            </Skeleton>

            <MuiAvatar
                {...props}
                sx={{
                    ...props.sx,
                    display: loaded ? "inherit" : "none",
                }}
            />
        </>
    );
};

export default Avatar;
