import {
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { IoOpenOutline, IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Report } from "../../../../../src/api/endpoints/reports";

interface ReportPageOverviewListProps {
  reports?: Report[]; 
}

const ReportPageOverviewList: FunctionComponent<
ReportPageOverviewListProps
> = ({
  reports
}) => {
  return (
    <Stack spacing={2}>
      {reports?.map((report) => (
        <OverviewListItem report={report} />
      ))}
    </Stack>
  );
};

interface OverviewListItemProps {
  report: Report;
}

const OverviewListItem: FunctionComponent<OverviewListItemProps> = (
  {
    report,
  }
) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={0.5}>
      <Card
        component={Button}
        sx={{
          display: "block",
          textAlign: "left",
          padding: 0,
          flex: 1,
        }}
      >
        <Stack direction="row">
          <Grid
            container
            alignItems="center"
            p={2}
            columns={{ xs: 1, md: 2 }}
            justifyContent="space-between"
            gap={{ xs: 2, md: 4 }}
            onClick={() => navigate(`/${report.id}`)} // Navigate to the incident page
          >
            <Grid item>
              <Stack spacing={1}>
                <Typography variant="body2">{report.id}</Typography>

                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="api" color="info" />
                  <Chip size="small" label="reports" color="info" />
                </Stack>
              </Stack>
            </Grid>

            <Grid
              item
              direction="row"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={2}
            >

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <IoStatsChart size={38} />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Card>

      <Tooltip title="Open in a new tab">
        <Card component={Button} color="primary">
          <IoOpenOutline size={18} />
        </Card>
      </Tooltip>
    </Stack>
  );
};

export default ReportPageOverviewList;
