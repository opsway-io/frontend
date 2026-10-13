import { Sheet, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { useStatusPages } from "../../../../hooks/statuspages.query";
import StatusPageOverviewListItem from "./StatusPageOverviewListItem";

const StatusPageOverviewList: FunctionComponent = () => {
  const { data, isPending, error } = useStatusPages();

  if (isPending) {
    return (
      <Typography level="body-sm" textColor="text.secondary">
        Loading...
      </Typography>
    );
  }

  if (error || !data) {
    return (
      <Typography level="body-sm" color="danger">
        Error loading status pages
      </Typography>
    );
  }

  if (data.statusPages.length === 0) {
    return (
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "lg",
          borderStyle: "dashed",
          p: 4,
          textAlign: "center",
        }}
      >
        <Typography level="body-sm" textColor="text.secondary">
          No status pages found
        </Typography>
      </Sheet>
    );
  }

  return (
    <Stack spacing={1}>
      {data.statusPages.map((statusPage) => (
        <StatusPageOverviewListItem
          key={statusPage.id}
          statusPage={statusPage}
        />
      ))}
    </Stack>
  );
};

export default StatusPageOverviewList;
