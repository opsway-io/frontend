import { Skeleton, Stack } from "@mui/joy";
import { FunctionComponent } from "react";

const MonitorsListSkeleton: FunctionComponent = () => (
  <>
    <Skeleton variant="rectangular" height={40} sx={{ borderRadius: "lg" }} />
    <Stack direction="row" spacing={1}>
      <Skeleton
        variant="rectangular"
        height={36}
        sx={{ flex: 1, borderRadius: "md" }}
      />
      <Skeleton
        variant="rectangular"
        height={36}
        width={90}
        sx={{ borderRadius: "md" }}
      />
    </Stack>
    <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "lg" }} />
  </>
);

export default MonitorsListSkeleton;
