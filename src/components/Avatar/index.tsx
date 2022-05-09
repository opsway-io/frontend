import { Avatar as MuiAvatar, AvatarProps, Skeleton } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";

const Avatar: FunctionComponent<AvatarProps> = (props) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (props.src) {
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
                width={40}
                height={40}
                sx={{
                    display: !loaded ? "inherit" : "none",
                }}
            />

            <MuiAvatar
                {...props}
                sx={{
                    display: loaded ? "inherit" : "none",
                }}
            />
        </>
    );
};

export default Avatar;
