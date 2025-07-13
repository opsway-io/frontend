import { FunctionComponent } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import Placeholder from "../../../components/Placeholder";
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useReports } from "../../../hooks/reports.query";
import ReportPageOverviewList from "./components/OverviewList";


const ReportsView: FunctionComponent = () => {
    // Get reports
      const {
        data: teamReports,
        error: reportsError,
        isLoading: reportsAreLoading,
      } = useReports();
  return (
    <>
      <Helmet>
        <title>Reports</title>
      </Helmet>

      <Container header="Reports">
        <Grid container spacing={2}>
          <Grid item xs={12 / 2} md={12 / 4} lg={12 / 5}>
            <Card component={Button} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.primary">
                  Uptime overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  An overview of uptime across all your monitors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12 / 2} md={12 / 4} lg={12 / 5}>
            <Card component={Button} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.primary">
                  Performance overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  An overview of response time across all your monitors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12 / 2} md={12 / 4} lg={12 / 5}>
            <Card component={Button} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.primary">
                  Incident Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  An overview of incidents across all your monitors.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12 / 2} md={12 / 4} lg={12 / 5}>
            <Card component={Button} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.primary">
                  All in!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  A report with all the information you need.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12 / 2} md={12 / 4} lg={12 / 5}>
            <Card component={Button} variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.primary">
                  Custom report
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  A report tailored with the information you specify.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack>
          <Typography variant="h6" color="text.primary">
            Previous reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reports that have been generated within the last year.
          </Typography>
        </Stack>

        {reportsAreLoading ? (<Placeholder />) :
             ( <ReportPageOverviewList reports={teamReports?.reports} />)
        }
      </Container>
    </>
  );
};

export default ReportsView;
