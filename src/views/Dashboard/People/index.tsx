import { Button, Card, Chip, List, ListItemAvatar, ListItemButton, ListItemText, Stack } from "@mui/material";
import { FunctionComponent, useState } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import * as falso from "@ngneat/falso";
import { IoLinkOutline, IoMailOutline } from "react-icons/io5";
import EmailsDialog from "./EmailsDialog";
import LinkDialog from "./LinkDialog";
import Avatar from "../../../components/Avatar";
import usePeople from "../../../stores/people";

const PeopleView: FunctionComponent = () => {
    const [openLinkDialog, setOpenLinkDialog] = useState(false);
    const [openEmailsDialog, setOpenEmailsDialog] = useState(false);

    const people = usePeople();

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
        <>
            <Container>
                <ContainerHeader>People</ContainerHeader>

                <Stack direction="row" alignItems="left" spacing={2}>
                    <Button startIcon={<IoLinkOutline />} onClick={(_) => setOpenLinkDialog(true)}>
                        Invite people with a link
                    </Button>
                    <Button startIcon={<IoMailOutline />} onClick={(_) => setOpenEmailsDialog(true)}>
                        Invite people by email
                    </Button>
                </Stack>

                <Card>
                    <List disablePadding>
                        {people.users?.map((user, i) => (
                            <ListItemButton divider key={i}>
                                <ListItemAvatar color="grey">
                                    <Avatar src={user.picture} />
                                </ListItemAvatar>
                                <ListItemText primary={`${user.firstName} ${user.lastName}`} secondary={user.email} />
                                <Chip label={"Member"} color={chipToColor("Member")} />
                            </ListItemButton>
                        ))}
                    </List>
                </Card>
            </Container>

            <EmailsDialog open={openEmailsDialog} onClose={() => setOpenEmailsDialog(false)} />
            <LinkDialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)} />
        </>
    );
};

export default PeopleView;
