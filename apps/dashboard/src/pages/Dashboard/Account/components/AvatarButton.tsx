import { Box } from "@mui/joy";
import { FunctionComponent } from "react";
import Avatar from "../../../../components/Avatar/Avatar";

interface AvatarButtonProps {
  src?: string;
  name?: string;
  label: string;
  onClick: () => void;
}

/** A large avatar that opens the change-avatar dialog when clicked. */
const AvatarButton: FunctionComponent<AvatarButtonProps> = ({
  src,
  name,
  label,
  onClick,
}) => (
  <Box
    component="button"
    type="button"
    aria-label={label}
    onClick={onClick}
    sx={{
      p: 0,
      border: "none",
      bgcolor: "transparent",
      cursor: "pointer",
      borderRadius: "lg",
      transition: "opacity 150ms",
      "&:hover": { opacity: 0.8 },
      "&:focus-visible": {
        outline: "2px solid",
        outlineColor: "focusVisible",
        outlineOffset: 2,
      },
    }}
  >
    <Avatar
      src={src}
      name={name}
      sx={{ width: 72, height: 72, borderRadius: "lg", fontSize: "xl" }}
    />
  </Box>
);

export default AvatarButton;
