import { Skeleton } from "@mui/joy";
import { FunctionComponent } from "react";

const ContainerSkeleton: FunctionComponent = () => {
  return (
    <>
      <Skeleton variant="rectangular" height={50} sx={{ borderRadius: "md" }} />
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ borderRadius: "lg" }}
      />
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ borderRadius: "lg" }}
      />
    </>
  );
};

export default ContainerSkeleton;
