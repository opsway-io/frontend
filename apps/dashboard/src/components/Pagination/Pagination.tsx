import { IconButton, Option, Select, Stack, Typography } from "@mui/joy";
import { FunctionComponent } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  rowsPerPageOptions?: number[];
}

/**
 * Server side pagination controls (range label, prev/next and an optional
 * rows-per-page select).
 */
const Pagination: FunctionComponent<PaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25],
}) => {
  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);
  const lastPage = Math.max(0, Math.ceil(count / rowsPerPage) - 1);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="flex-end"
      spacing={1.5}
      sx={{ pt: 1 }}
    >
      {onRowsPerPageChange && (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography level="body-xs" textColor="text.tertiary">
            Rows per page
          </Typography>
          <Select
            size="sm"
            value={rowsPerPage}
            onChange={(_, v) => v && onRowsPerPageChange(v)}
            sx={{ minWidth: 64 }}
          >
            {rowsPerPageOptions.map((o) => (
              <Option key={o} value={o}>
                {o}
              </Option>
            ))}
          </Select>
        </Stack>
      )}
      <Typography level="body-xs" textColor="text.secondary">
        {from}–{to} of {count}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <IconButton
          variant="outlined"
          color="neutral"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <IoChevronBack />
        </IconButton>
        <IconButton
          variant="outlined"
          color="neutral"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <IoChevronForward />
        </IconButton>
      </Stack>
    </Stack>
  );
};

export default Pagination;
