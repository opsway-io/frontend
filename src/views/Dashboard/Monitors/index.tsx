import {
    Avatar,
    Button,
    Card,
    CardContent,
    IconButton,
    InputBase,
    List,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    ListItemSecondaryAction,
    ListItem,
    useTheme,
} from "@mui/material";
import { FunctionComponent } from "react";
import { IoCheckmark, IoSearch, IoPause, IoPlay } from "react-icons/io5";
import { RiMore2Line } from "react-icons/ri";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import PulsingDot from "../../../components/PulsingDot";
import ResultThumbGraph from "../../../components/ResultThumbGraph";
import useMonitors from "../../../stores/monitors";

const MonitorsView: FunctionComponent = () => {
    const theme = useTheme();
    const monitorsStore = useMonitors();

    return (
        <Container>
            <ContainerHeader>Monitors</ContainerHeader>

            <Card>
                <CardContent sx={{ '&:last-child': { pb: theme.spacing(2) }}}>
                    <Stack spacing={2} direction="row" alignItems="center">
                        <PulsingDot />

                        <div>All monitors are active</div>

                        <Button
                            startIcon={<IoPause color="#f5de88" />}
                            style={{
                                marginLeft: "auto",
                            }}
                        >
                            Pause all
                        </Button>

                        <Button startIcon={<IoPlay color="#84be79" />}>Run all now</Button>
                    </Stack>
                </CardContent>
            </Card>

            <Card sx={{
                textAlign: "center",
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                fontSize: theme.typography.h6.fontSize,
                fontWeight: 500,
                padding: theme.spacing(2),
            }}>
                5 checks are passing
            </Card>

            <Card>
                <CardContent>
                    <Stack direction="row" alignContent="center">
                        <Paper
                            style={{
                                backgroundColor: "#eef2f7",
                            }}
                        >
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                style={{
                                    minWidth: "300px",
                                }}
                                placeholder="Search by name, request URL..."
                            />
                            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                <IoSearch />
                            </IconButton>
                        </Paper>
                        <Button
                            variant="contained"
                            color="success"
                            style={{
                                marginLeft: "auto",
                            }}
                        >
                            Create new
                        </Button>
                    </Stack>
                </CardContent>

                <List disablePadding>
                    {monitorsStore.monitors?.map((monitor, index) => (
                        <ListItem divider key={index}>
                            <ListItemAvatar>
                                <Avatar
                                    style={{
                                        backgroundColor: "#84be79",
                                    }}
                                >
                                    <IoCheckmark />
                                </Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={monitor.name}
                                secondary={monitor.lastRunTimestamp ? `Last run ${monitor.lastRunTimestamp}` : "No runs yet"}
                                style={{
                                    flex: "0 0 auto",
                                    marginRight: theme.spacing(4),
                                }}
                            />

                            <ListItemText
                                style={{
                                    flex: "0 0 auto",
                                    marginRight: theme.spacing(4),
                                }}
                            >
                                <ResultThumbGraph />
                            </ListItemText>

                            <ListItemSecondaryAction>
                                <IconButton>
                                    <RiMore2Line />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Card>

            {/* <CustomizedDialogs /> */}
        </Container>
    );
};

export default MonitorsView;
