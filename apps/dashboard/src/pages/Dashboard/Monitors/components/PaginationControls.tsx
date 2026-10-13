import { IconButton, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationControlsProps {
  /** Zero based page index. */
  page: number;
  /** Total number of pages, if known. */
  pageCount?: number;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const PaginationControls: FunctionComponent<PaginationControlsProps> = (
  props,
) => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
    >
      <IconButton
        variant="outlined"
        color="neutral"
        aria-label="Previous page"
        disabled={props.page === 0}
        onClick={props.onPrevious}
      >
        <IoChevronBack />
      </IconButton>
      <Typography level="body-sm" textColor="text.secondary">
        Page {props.page + 1}
        {props.pageCount !== undefined && ` of ${props.pageCount}`}
      </Typography>
      <IconButton
        variant="outlined"
        color="neutral"
        aria-label="Next page"
        disabled={!props.hasNext}
        onClick={props.onNext}
      >
        <IoChevronForward />
      </IconButton>
    </Stack>
  );
};

export default PaginationControls;
