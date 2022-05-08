import { Avatar, Button, Card, Chip, List, ListItemAvatar, ListItemButton, ListItemText, Stack } from "@mui/material";
import { FunctionComponent, useState } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import * as falso from "@ngneat/falso";
import { IoLinkOutline, IoMailOutline } from "react-icons/io5";
import CustomizedDialogs from "./dialog";

const TeamView: FunctionComponent = () => {
    const [open, setOpen] = useState(false);

    const n = 10;
    const names = falso.randFullName({ length: n });
    const emails = falso.randEmail({ length: n });
    const chips = falso.rand(["Owner", "Manager", "Member"], { length: n });
    const images = falso.randImg({
        width: 40,
        height: 40,
        category: "people",
        length: n,
    });

    const chipToColor = (chip: string) => {
        switch (chip) {
            case "Owner":
                return "primary";
            case "Manager":
                return "success";
            case "Member":
                return "info";
        }
    };

    return (
        <Container>
            <ContainerHeader>People</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button startIcon={<IoLinkOutline />} onClick={(_) => setOpen(true)}>
                    Invite people with a link
                </Button>
                <Button startIcon={<IoMailOutline />} onClick={(_) => setOpen(true)}>
                    Invite people by email
                </Button>
            </Stack>

            <Card>
                <List disablePadding>
                    {names.map((name, i) => (
                        <ListItemButton divider>
                            <ListItemAvatar color="grey">
                                <Avatar src={images[i]} />
                            </ListItemAvatar>
                            <ListItemText primary={name} secondary={emails[i]} />
                            <Chip label={chips[i]} color={chipToColor(chips[i])} />
                        </ListItemButton>
                    ))}
                </List>
            </Card>

            <CustomizedDialogs
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            />
        </Container>
    );
};

export default TeamView;
