import { Button, Card, IconButton, Input, Stack } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { IoAdd, IoClose, IoCloudUploadOutline, IoSearch } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import Container from "../../../components/Container/Container";
import { Role } from "../../../components/Restrict";
import {
  useMonitorsIncidents,
  useSearchMonitors,
} from "../../../hooks/monitors.query";
import { useCurrentUserRole } from "../../../hooks/user.query";
import { useDebounce } from "../../../hooks/useDebounce";
import ImportOpenAPIModal from "./components/ImportOpenAPIModal/ImportOpenAPIModal";
import MonitorsDataGrid from "./components/MonitorsDataGrid";
import MonitorsEmptyState from "./components/MonitorsEmptyState";
import MonitorsListSkeleton from "./components/MonitorsListSkeleton";
import MonitorsStatusBanner from "./components/MonitorsStatusBanner";
import PaginationControls from "./components/PaginationControls";

const MONITORS_PER_PAGE = 10;

const MonitorsPage: FunctionComponent = () => {
  const currentRole = useCurrentUserRole();
  const isAdmin = Role.ADMIN.equalOrHigher(currentRole);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);
  const [offset, setOffset] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const { data, isPending, error } = useSearchMonitors(
    offset,
    MONITORS_PER_PAGE,
    debouncedQuery,
  );

  const hasNoMonitors = data?.totalCount === 0 && !debouncedQuery;
  const { data: monitorsIncidents } = useMonitorsIncidents();
  const failingCount =
    monitorsIncidents?.monitors?.filter((m) => m.incidents?.length > 0)
      .length ?? 0;

  const page = Math.floor(offset / MONITORS_PER_PAGE);
  const pageCount = Math.max(
    1,
    Math.ceil((data?.totalCount || 0) / MONITORS_PER_PAGE),
  );

  const openImportModal = () => setIsImportModalOpen(true);

  return (
    <>
      <Helmet>
        <title>Monitors</title>
      </Helmet>

      <Container
        loading={isPending || !currentRole}
        error={
          error ? "Failed to load monitors, try to reload the page." : undefined
        }
        header="Monitors"
        hideHeader={data?.totalCount === 0}
        description="Monitors allow you to actively keep an eye on the uptime of your websites and APIs."
        secondaryActions={
          isAdmin
            ? [
                data?.monitors.length !== 0 && (
                  <Button
                    key="create"
                    startDecorator={<IoAdd />}
                    component={NavLink}
                    to="/monitors/create"
                  >
                    Create monitor
                  </Button>
                ),
                <Button
                  key="import"
                  variant="outlined"
                  color="neutral"
                  startDecorator={<IoCloudUploadOutline />}
                  onClick={openImportModal}
                >
                  Import from OpenAPI
                </Button>,
              ]
            : []
        }
        skeleton={<MonitorsListSkeleton />}
      >
        {hasNoMonitors ? (
          <MonitorsEmptyState onImportClick={openImportModal} />
        ) : (
          <>
            <MonitorsStatusBanner failingCount={failingCount} />

            <Stack
              direction="row"
              spacing={1}
              component="form"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input
                sx={{ flex: 1 }}
                startDecorator={<IoSearch />}
                placeholder="Search monitors"
                aria-label="Search monitors"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOffset(0);
                }}
                endDecorator={
                  query ? (
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="neutral"
                      onClick={() => {
                        setQuery("");
                        setOffset(0);
                      }}
                      aria-label="Clear search"
                    >
                      <IoClose size={16} />
                    </IconButton>
                  ) : null
                }
              />
            </Stack>

            <Card sx={{ p: 0, gap: 0, overflow: "hidden" }}>
              <MonitorsDataGrid monitors={data?.monitors} pageSize={0} />
            </Card>

            {pageCount > 1 && (
              <PaginationControls
                page={page}
                pageCount={pageCount}
                hasNext={page < pageCount - 1}
                onPrevious={() =>
                  setOffset(Math.max(0, offset - MONITORS_PER_PAGE))
                }
                onNext={() => setOffset(offset + MONITORS_PER_PAGE)}
              />
            )}
          </>
        )}
      </Container>

      <ImportOpenAPIModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </>
  );
};

export default MonitorsPage;
