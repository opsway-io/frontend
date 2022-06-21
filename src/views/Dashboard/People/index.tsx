import { Button, Card, Chip, Stack, TextField, Typography } from "@mui/material";
import { FunctionComponent, useState } from "react";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import { IoLinkOutline, IoMailOutline } from "react-icons/io5";
import EmailsDialog from "./EmailsDialog";
import Avatar from "../../../components/Avatar";
import usePeople from "../../../stores/people";
import DataGrid from "../../../components/DataGrid";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { User } from "../../../interfaces/user";
import { useSnackbar } from "notistack";

const PeopleView: FunctionComponent = () => {
    const [openEmailsDialog, setOpenEmailsDialog] = useState(false);

    const people = usePeople();

    const { enqueueSnackbar } = useSnackbar();

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

    const rows: GridRowsProp<User> =
        people.users?.map((u) => ({
            id: u.id,
            picture: u.picture,
            name: u.name,
            email: u.email,
            role: "Member",
        })) || [];

    const columns: GridColDef[] = [
        {
            field: "picture",
            headerName: "",
            width: 70,
            align: "right",
            sortable: false,
            renderCell: (row) => <Avatar src={row.value} />,
        },
        { field: "name", headerName: "Name", width: 300, sortable: true },
        {
            field: "email",
            headerName: "Email",
            width: 300,
            sortable: true,
            renderCell: (row) => (
                <>
                    <IoMailOutline /> <Typography sx={{ marginLeft: 1 }}>{row.value}</Typography>
                </>
            ),
        },
        {
            field: "role",
            headerName: "",
            flex: 1,
            align: "right",
            headerAlign: "right",
            sortable: true,
            renderCell: (row) => <Chip label={row.value} color={chipToColor(row.value)} />,
        },
    ];

    return (
        <>
            <Container>
                <ContainerHeader>People</ContainerHeader>

                <Stack direction="row" alignItems="left" spacing={2}>
                    <Button
                        startIcon={<IoLinkOutline />}
                        onClick={(_) =>
                            enqueueSnackbar("Link copied to clipboard", {
                                variant: "info",
                            })
                        }
                    >
                        Invite people with a link
                    </Button>
                    <Button startIcon={<IoMailOutline />} onClick={(_) => setOpenEmailsDialog(true)}>
                        Invite people by email
                    </Button>
                </Stack>

                <Card sx={{ flex: 1 }}>
                    <DataGrid columns={columns} rows={rows} />
                </Card>
            </Container>

            <EmailsDialog open={openEmailsDialog} onClose={() => setOpenEmailsDialog(false)} />
        </>
    );
};

export default PeopleView;
