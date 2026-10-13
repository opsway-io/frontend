import { Box, Card, Typography } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import Pagination from "../../../../../components/Pagination/Pagination";
import Placeholder from "../../../../../components/Placeholder/Placeholder";
import { Timeline } from "../../../../../components/Timeline";

interface HistoryCardProps {
  title: string;
  subheader: ReactNode;
  isLoading: boolean;
  emptyText: string;
  totalCount: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  /** `TimelineItem`s of the current page; nothing renders the empty text. */
  children?: ReactNode[];
}

/** Card with a paginated timeline of incident events. */
const HistoryCard: FunctionComponent<HistoryCardProps> = ({
  title,
  subheader,
  isLoading,
  emptyText,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  children,
}) => {
  const isEmpty = !children || children.length === 0;

  return (
    <Card>
      <Box>
        <Typography level="title-md">{title}</Typography>
        <Typography level="body-sm" textColor="text.secondary">
          {subheader}
        </Typography>
      </Box>

      {isLoading && <Placeholder />}

      {!isLoading && isEmpty && (
        <Typography
          level="body-sm"
          textColor="text.tertiary"
          sx={{ textAlign: "center", py: 2 }}
        >
          {emptyText}
        </Typography>
      )}

      {!isLoading && !isEmpty && (
        <>
          <Box sx={{ pt: 1 }}>
            <Timeline>{children}</Timeline>
          </Box>
          <Pagination
            count={totalCount}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(value) => {
              onRowsPerPageChange(value);
              onPageChange(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}
    </Card>
  );
};

export default HistoryCard;
