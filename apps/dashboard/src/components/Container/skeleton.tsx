import { Skeleton } from "@mui/material";
import { FunctionComponent } from "react";

interface ContainerSkeletonProps {}

const ContainerSkeleton: FunctionComponent<ContainerSkeletonProps> = () => {
  return (
    <>
      <Skeleton variant="rectangular" height={50} />
      <Skeleton variant="rectangular" height={200} />
      <Skeleton variant="rectangular" height={200} />
    </>
  );
};

export default ContainerSkeleton;
