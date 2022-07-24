import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import Container from "../../../components/Container";
import ContainerHeader from "../../../components/Container/header";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { alpha, Button, Card, CardContent, CardHeader, Stack, useTheme } from "@mui/material";
import { GoSettings } from "react-icons/go";
import { IoPause, IoPlay } from "react-icons/io5";
import Placeholder from "../../../components/Placeholder";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function get24hLabels(): string[] {
    return [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
    ];
}

const MonitorView: FunctionComponent = () => {
    const { id } = useParams<string>();
    const theme = useTheme();

    const data = [];
    for (let i = 0; i < 24; i++) {
        data[i] = Math.random() * 100;
    }

    return (
        <Container>
            <ContainerHeader>Monitor name</ContainerHeader>

            <Stack direction="row" alignItems="left" spacing={2}>
                <Button
                    startIcon={<IoPlay />}
                    sx={{
                        span: {
                            color: theme.palette.success.main,
                        },
                    }}
                >
                    Run check now
                </Button>
                <Button
                    startIcon={<IoPause />}
                    sx={{
                        span: {
                            color: theme.palette.warning.main,
                        },
                    }}
                >
                    Pause monitor{" "}
                </Button>
                <Button
                    startIcon={<GoSettings />}
                    sx={{
                        span: {
                            color: theme.palette.grey[800],
                        },
                    }}
                >
                    Configure
                </Button>
            </Stack>

            <Card>
                <CardHeader title="Response times" subheader="Response times from the last 24 hours" />
                <CardContent>
                    <Line
                        options={{
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            scales: {
                                y: {
                                    ticks: {
                                        callback: function (value, index, ticks) {
                                            return value + " ms";
                                        },
                                        stepSize: 10,
                                    },
                                    min: 0,
                                    beginAtZero: true,
                                },
                            },
                            animation: {
                                duration: theme.transitions.duration.shortest,
                            },
                        }}
                        height={75}
                        data={{
                            labels: get24hLabels(),
                            datasets: [
                                {
                                    data: data,
                                    label: "Response time (ms)",
                                    pointRadius: 0,
                                    fill: true,
                                    backgroundColor: alpha(theme.palette.info.main, 0.25),
                                    borderColor: theme.palette.info.main,
                                },
                            ],
                        }}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Results" subheader="Detailed monitor results" />
                <CardContent>
                    <Placeholder />
                </CardContent>
            </Card>
        </Container>
    );
};

export default MonitorView;
