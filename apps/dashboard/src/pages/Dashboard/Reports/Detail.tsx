import { FunctionComponent, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
} from "@mui/material";
import { IoChevronBack, IoDownloadOutline } from "react-icons/io5";
import { useReport } from "../../../hooks/reports.query";
import { useMonitors } from "../../../hooks/monitors.query";
import { PerformanceChart, IncidentChart } from "./components/ReportCharts";

const ReportDetailView: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading: reportLoading } = useReport(Number(id));
  const { data: monitorsData, isLoading: monitorsLoading } = useMonitors(0, 1000);

  const monitorsMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (monitorsData?.monitors) {
      monitorsData.monitors.forEach((m: any) => {
        map[m.id] = m.name;
      });
    }
    return map;
  }, [monitorsData]);

  const isLoading = reportLoading || monitorsLoading;

  const handleDownload = () => {
    if (!report?.data) return;
    const blob = new Blob([JSON.stringify(report.data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${report.id}-${report.type}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMonitorName = (id: number) => monitorsMap[id] || `Monitor #${id}`;

  const summary = useMemo(() => {
    if (!report?.data) return null;
    let avgUptime = 0;
    let avgResponseTime = 0;
    let totalIncidents = 0;

    if (report.data.uptime?.length) {
      const sum = report.data.uptime.reduce((a, b) => a + b.UptimePercentage, 0);
      avgUptime = sum / report.data.uptime.length;
    }
    if (report.data.performance?.length) {
      const sum = report.data.performance.reduce(
        (a, b) => a + b.AverageResponseTime,
        0
      );
      avgResponseTime = sum / report.data.performance.length;
    }
    if (report.data.incident?.length) {
      totalIncidents = report.data.incident.reduce((a, b) => a + b.count, 0);
    }
    return { avgUptime, avgResponseTime, totalIncidents };
  }, [report]);

  if (isLoading) {
    return (
      <Container
        header={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button component={Link} to="/reports" startIcon={<IoChevronBack />}>
              Back
            </Button>
            <Typography variant="h4">Loading Report...</Typography>
          </Stack>
        }
      >
        <Placeholder />
      </Container>
    );
  }

  if (!report) {
    return (
      <Container
        header={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button component={Link} to="/reports" startIcon={<IoChevronBack />}>
              Back
            </Button>
            <Typography variant="h4">Report Not Found</Typography>
          </Stack>
        }
      >
        <Typography>The report you requested could not be found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Report ${report.id}`}</title>
      </Helmet>

      <Container
        header={
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button component={Link} to="/reports" startIcon={<IoChevronBack />}>
                Back
              </Button>
              <Typography variant="h4">Report #{report.id}</Typography>
              <Chip size="small" label={report.type} color="info" />
              <Chip
                size="small"
                label={report.status}
                color={
                  report.status === "COMPLETED"
                    ? "success"
                    : report.status === "FAILED"
                    ? "error"
                    : "warning"
                }
              />
            </Stack>
            <Button
              variant="contained"
              startIcon={<IoDownloadOutline />}
              onClick={handleDownload}
              disabled={report.status !== "COMPLETED"}
            >
              Download JSON
            </Button>
          </Stack>
        }
      >
        <Stack spacing={4}>
          <Box>
            <Typography variant="subtitle1" color="text.secondary">
              Created At: {new Date(report.createdAt).toLocaleString()}
            </Typography>
          </Box>

          {report.status === "COMPLETED" && report.data && summary && (
            <Grid container spacing={2}>
              {(report.type === "UPTIME" || report.type === "ALL" || report.type === "CUSTOM") && report.data.uptime && (
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Average Uptime
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        {summary.avgUptime.toFixed(2)}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {(report.type === "PERFORMANCE" || report.type === "ALL" || report.type === "CUSTOM") && report.data.performance && (
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Average Response Time
                      </Typography>
                      <Typography variant="h4" color="info.main">
                        {summary.avgResponseTime.toFixed(0)} ms
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              {(report.type === "INCIDENT" || report.type === "ALL" || report.type === "CUSTOM") && report.data.incident && (
                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Incidents
                      </Typography>
                      <Typography variant="h4" color="error.main">
                        {summary.totalIncidents}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}

          {report.status === "COMPLETED" && report.data?.uptime && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Uptime Report
              </Typography>
              <Card variant="outlined">
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }} aria-label="uptime table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Monitor</TableCell>
                        <TableCell>URL</TableCell>
                        <TableCell>Date / Month</TableCell>
                        <TableCell align="right">Uptime %</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.data.uptime.map((row: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Stack>
                              <Typography variant="body2" fontWeight="bold">
                                {getMonitorName(row.MonitorID)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {row.MonitorID}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>{row.Url}</TableCell>
                          <TableCell>{row.Date}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                            {row.UptimePercentage.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {report.status === "COMPLETED" && report.data?.performance && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Performance Report
              </Typography>
              <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                <PerformanceChart data={report.data} monitorsMap={monitorsMap} />
              </Card>
              <Card variant="outlined">
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }} aria-label="performance table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Monitor</TableCell>
                        <TableCell align="right">Avg. Response Time</TableCell>
                        <TableCell align="right">P95</TableCell>
                        <TableCell align="right">P99</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.data.performance.map((row: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Stack>
                              <Typography variant="body2" fontWeight="bold">
                                {getMonitorName(row.MonitorID)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {row.MonitorID}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{row.AverageResponseTime.toFixed(0)} ms</TableCell>
                          <TableCell align="right">{row.P95.toFixed(0)} ms</TableCell>
                          <TableCell align="right">{row.P99.toFixed(0)} ms</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}

          {report.status === "COMPLETED" && report.data?.incident && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Incidents Report
              </Typography>
              <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                <IncidentChart data={report.data} monitorsMap={monitorsMap} />
              </Card>
              <Card variant="outlined">
                <TableContainer component={Paper} elevation={0}>
                  <Table sx={{ minWidth: 650 }} aria-label="incident table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Monitor</TableCell>
                        <TableCell align="right">Incident Count</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.data.incident.map((row: any, i: number) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Stack>
                              <Typography variant="body2" fontWeight="bold">
                                {getMonitorName(row.monitorId)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                ID: {row.monitorId}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="right">{row.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ReportDetailView;
