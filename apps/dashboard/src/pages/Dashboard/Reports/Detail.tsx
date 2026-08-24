import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import { useParams, Link } from "react-router-dom";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import {
  Box,
  Button,
  Card,
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
} from "@mui/material";
import { IoChevronBack, IoDownloadOutline } from "react-icons/io5";
import { useReport } from "../../../hooks/reports.query";

const ReportDetailView: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: report, isLoading } = useReport(Number(id));

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

  if (isLoading) {
    return (
      <Container
        header={
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              component={Link}
              to="/reports"
              startIcon={<IoChevronBack />}
            >
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
            <Button
              component={Link}
              to="/reports"
              startIcon={<IoChevronBack />}
            >
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
              <Button
                component={Link}
                to="/reports"
                startIcon={<IoChevronBack />}
              >
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

          {report.status === "COMPLETED" && report.data?.uptime && (
            <Card variant="outlined">
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} aria-label="uptime table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Monitor ID</TableCell>
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
                          {row.MonitorID}
                        </TableCell>
                        <TableCell>{row.Url}</TableCell>
                        <TableCell>{row.Date}</TableCell>
                        <TableCell align="right">
                          {row.UptimePercentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}

          {report.status === "COMPLETED" && !report.data?.uptime && (
            <Typography color="text.secondary">
              Report data for this type is not yet visualized in the dashboard.
              Please use the Download JSON button.
            </Typography>
          )}
        </Stack>
      </Container>
    </>
  );
};

export default ReportDetailView;
