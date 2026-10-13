import { IconButton, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface DataGridPaginationProps {
  /** Zero-based page index. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const DataGridPagination: FunctionComponent<DataGridPaginationProps> = ({
  page,
  pageCount,
  onPageChange,
}) => (
  <Stack
    direction="row"
    justifyContent="center"
    alignItems="center"
    spacing={1}
    sx={{ pt: 1.5 }}
  >
    <IconButton
      variant="outlined"
      disabled={page === 0}
      onClick={() => onPageChange(page - 1)}
      aria-label="Previous page"
    >
      <IoChevronBack />
    </IconButton>
    <Typography level="body-sm" textColor="text.secondary">
      Page {page + 1} of {pageCount}
    </Typography>
    <IconButton
      variant="outlined"
      disabled={page >= pageCount - 1}
      onClick={() => onPageChange(page + 1)}
      aria-label="Next page"
    >
      <IoChevronForward />
    </IconButton>
  </Stack>
);

export default DataGridPagination;
