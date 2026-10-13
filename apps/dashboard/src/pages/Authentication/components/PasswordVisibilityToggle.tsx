import { IconButton } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

interface PasswordVisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
}

/** Eye button used as the end decorator of password inputs. */
const PasswordVisibilityToggle: FunctionComponent<
  PasswordVisibilityToggleProps
> = ({ visible, onToggle }) => (
  <IconButton
    aria-label="toggle password visibility"
    variant="plain"
    color="neutral"
    onClick={onToggle}
  >
    {visible ? <IoEyeOffOutline /> : <IoEyeOutline />}
  </IconButton>
);

export default PasswordVisibilityToggle;
