import { Avatar, Button, Card, CardContent, Stack, Typography, useTheme } from "@mui/material";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { FunctionComponent, memo } from "react";
import { IoAddCircleSharp, IoCheckmark, IoPause } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import DataGrid from "../../../components/DataGrid";
import PulsingDot from "../../../components/PulsingDot";
import ResultThumbGraph from "../../../components/ResultThumbGraph";
import useMonitors from "../../../stores/monitors";
import ItemMenu from "./components/itemMenu";

const MonitorsView: FunctionComponent = () => {
    const theme = useTheme();
    const monitorsStore = useMonitors();
    const navigate = useNavigate();

    const rows: GridRowsProp =
        monitorsStore.monitors?.map((monitor) => ({
            id: monitor.id,
            name: monitor.name,
            lastRunTimestamp: monitor.lastRunTimestamp,
        })) || [];

    const columns: GridColDef[] = [
        {
            field: "status",
            headerName: "",
            width: 70,
            align: "right",
            sortable: false,
            renderCell: (row) => (
                <Avatar
                    sx={{
                        backgroundColor: theme.palette.success.main,
                    }}
                >
                    <IoCheckmark />
                </Avatar>
            ),
        },
        { field: "name", headerName: "Name", width: 300, sortable: true },
        {
            field: "stats",
            headerName: "Latest results",
            width: 320,
            sortable: false,
            renderCell: (row) => <ResultThumbGraph />,
        },
        { field: "stat-24h", headerName: "24H", sortable: true, valueGetter: () => "100%" },
        { field: "stat-7d", headerName: "7D", sortable: true, valueGetter: () => "100%" },
        { field: "stat-avg", headerName: "AVG", sortable: true, valueGetter: () => "86ms" },
        { field: "stat-p95", headerName: "P95", sortable: true, valueGetter: () => "105ms" },
        {
            field: "last-run-time",
            headerName: "Latest run",
            sortable: true,
            flex: 1,
            align: "right",
            headerAlign: "right",
            valueGetter: () => "2 minutes ago",
        },
        {
            field: "actions",
            headerName: "",
            align: "right",
            sortable: false,
            renderCell: (row) => <ItemMenu monitor={row.value} />,
        },
    ];

    return (
        <Container flex>
            <ContainerHeader>Monitors</ContainerHeader>

            <Card>
                <CardContent sx={{ "&:last-child": { pb: theme.spacing(2) } }}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <PulsingDot />

                        <div>All monitors are active</div>

                        <Button
                            startIcon={<IoPause />}
                            style={{
                                marginLeft: "auto",
                            }}
                            color="primary"
                            variant="outlined"
                        >
                            Pause all
                        </Button>

                        <Button
                            component={NavLink}
                            to="new"
                            color="success"
                            variant="contained"
                            startIcon={<IoAddCircleSharp />}
                        >
                            <Typography>New monitor</Typography>
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{ flex: 1 }}>
                <DataGrid columns={columns} rows={rows} onRowClick={r => {
                    navigate(`/monitors/${r.id}`);
                }}/>
            </Card>
        </Container>
    );
};

export default memo(MonitorsView);
