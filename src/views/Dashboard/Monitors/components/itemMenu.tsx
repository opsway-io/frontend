import { IconButton, ListItemIcon, Menu, MenuItem, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import { IoPlay, IoStopCircle, IoTrash } from "react-icons/io5";
import { TiPencil } from "react-icons/ti";
import { RiMore2Line } from "react-icons/ri";
import { Monitor } from "../../../../interfaces/monitor";

interface ItemMenuProps {
    monitor: Monitor;
}

const ItemMenu: FunctionComponent<ItemMenuProps> = () => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <>
            <IconButton
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                    setAnchorEl(event.currentTarget);
                    setOpen(true);
                    event.preventDefault();
                }}
            >
                <RiMore2Line />
            </IconButton>
            <Menu
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "right",
                }}
            >
                <MenuItem>
                    <ListItemIcon>
                        <IoPlay/>
                    </ListItemIcon>
                    <Typography variant="inherit">Run now</Typography>
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <IoStopCircle />
                    </ListItemIcon>
                    <Typography variant="inherit">Deactivate</Typography>
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <TiPencil />
                    </ListItemIcon>
                    <Typography variant="inherit">Edit</Typography>
                </MenuItem>

                <MenuItem>
                    <ListItemIcon>
                        <IoTrash />
                    </ListItemIcon>
                    <Typography variant="inherit">Delete</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ItemMenu;
