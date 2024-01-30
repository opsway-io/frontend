import { FunctionComponent, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Container from "../../../components/Container";
import { Button, Card, IconButton, InputBase, Paper } from "@mui/material";
import { IoAdd, IoSearch } from "react-icons/io5";
import { Restrict, Role } from "../../../components/Restrict";
import CreateChangelogModal from "./components/CreateChangelogModal";
import ChangelogsDataGrid from "./components/ChangelogsDataGrid";
import { useChangelogs } from "../../../hooks/changelogs.query";
import { useDebounce } from "../../../utilities/debounce";

const CHANGELOGS_PER_PAGE = 10;

const ChangelogView: FunctionComponent = () => {
  const [createChangelogModalOpen, setCreateChangelogModalOpen] =
    useState(false);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(0);
  }, [query]);

  const { data, isLoading } = useChangelogs(
    offset,
    CHANGELOGS_PER_PAGE,
    debouncedQuery ? debouncedQuery : undefined,
  );

  return (
    <>
      <Helmet>
        <title>Changelogs</title>
      </Helmet>

      <Container
        header="Changelog"
        description=" Central hub for managing your changelogs and release notes. You can
          manage your changelogs and release notes here or use our API to
          automate the process."
        secondaryActions={[
          <Restrict min={Role.ADMIN}>
            <Button
              startIcon={<IoAdd />}
              color="secondary"
              sx={{
                span: {
                  color: (t) => t.palette.success.main,
                },
              }}
              onClick={() => setCreateChangelogModalOpen(true)}
            >
              Create changelog
            </Button>
          </Restrict>,
        ]}
        loading={isLoading}
      >
        <Paper
          component="form"
          sx={{
            p: "0px 4px",
            display: "flex",
            alignItems: "center",
            flex: 1,
          }}
          variant="outlined"
        >
          <InputBase
            size="small"
            sx={{ marginLeft: 1, flex: 1, background: "transparent" }}
            placeholder="Search changelogs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <IconButton type="submit" sx={{ p: "10px" }} size="small">
            <IoSearch />
          </IconButton>
        </Paper>

        <Card>
          <ChangelogsDataGrid changelogs={data?.changelogs} />
        </Card>
      </Container>

      <CreateChangelogModal
        open={createChangelogModalOpen}
        onClose={() => setCreateChangelogModalOpen(false)}
      />
    </>
  );
};

export default ChangelogView;
