import {
  Button,
  ListSubheader,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { BsFilterRight } from "react-icons/bs";

interface FiltersMenuProps {}

const FiltersMenu: FunctionComponent<FiltersMenuProps> = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button
        sx={{
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
        endIcon={<BsFilterRight />}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          setAnchorEl(event.currentTarget);
          setOpen(true);
          event.stopPropagation();
        }}
      >
        Filters
      </Button>

      <Menu
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem>
          <Typography variant="inherit">Owner</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="inherit">Admin</Typography>
        </MenuItem>
        <MenuItem>
          <Typography variant="inherit">Member</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default FiltersMenu;
