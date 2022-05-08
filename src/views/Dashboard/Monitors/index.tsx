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
import CustomizedDialogs from "./dialog";

const MonitorsView: FunctionComponent = () => {
    const theme = useTheme();

    return (
        <Container>
            <ContainerHeader>Monitors</ContainerHeader>

            <Card>
                <CardContent>
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

                        <Button startIcon={<IoPlay color="#84be79" />}>
                            Run all now
                        </Button>
                    </Stack>
                </CardContent>
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
                    {[1, 2, 3, 4, 5].map((item, index) => (
                        <ListItem divider>
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
                                primary="User API"
                                secondary="2 minutes ago"
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
