import { Alert, Box, Typography } from "@mui/joy";
import moment from "moment";
import { FunctionComponent } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { GetIncidentResponse } from "../../../../../api/endpoints/incidents";
import PreformattedBlock from "./PreformattedBlock";

interface ResolvedIncidentBannerProps {
  incident: GetIncidentResponse;
}

const ResolvedIncidentBanner: FunctionComponent<
  ResolvedIncidentBannerProps
> = ({ incident }) => (
  <Alert
    color="success"
    variant="soft"
    startDecorator={<IoCheckmarkCircleOutline size={20} />}
    sx={{ alignItems: "flex-start" }}
  >
    <Box>
      <Typography level="title-sm" color="success" sx={{ mb: 0.5 }}>
        Resolved Incident: {incident.title}
      </Typography>
      <Typography level="body-sm" color="success" component="div">
        {incident.description && (
          <PreformattedBlock monospace>
            {incident.description}
          </PreformattedBlock>
        )}
        This incident occurred on {moment(incident.createdAt).format("LLL")} and
        was resolved{" "}
        {incident.resolvedBy
          ? `by ${incident.resolvedBy.displayName} `
          : "(auto-resolved) "}
        {incident.resolvedAt
          ? `on ${moment(incident.resolvedAt).format("LLL")}`
          : ""}
        .
      </Typography>
    </Box>
  </Alert>
);

export default ResolvedIncidentBanner;
