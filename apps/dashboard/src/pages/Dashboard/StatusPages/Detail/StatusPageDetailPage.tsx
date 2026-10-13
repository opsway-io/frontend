import { Typography } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, ReactNode, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link, useParams } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import Placeholder from "../../../../components/Placeholder/Placeholder";
import {
  useStatusPage,
  useUpdateStatusPage,
} from "../../../../hooks/statuspages.query";
import StatusPageForm from "../components/StatusPageForm";
import DeleteStatusPageCard from "./components/DeleteStatusPageCard";
import {
  StatusPageFormValues,
  toStatusPageFormValues,
} from "../statusPageForm";

const breadcrumbs = (current: ReactNode) => [
  <Link key="status-pages" to="/status-pages">
    Status pages
  </Link>,
  <span key="current">{current}</span>,
];

const StatusPageDetailPage: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const statusPageId = parseInt(id || "-1", 10);

  const { data: statusPage, isPending, error } = useStatusPage(statusPageId);
  const { mutateAsync: updateStatusPage, isPending: isUpdating } =
    useUpdateStatusPage(statusPageId);

  const initialValues = useMemo(
    () => (statusPage ? toStatusPageFormValues(statusPage) : undefined),
    [statusPage],
  );

  const onSubmit = async (values: StatusPageFormValues) => {
    try {
      await updateStatusPage(values);
      enqueueSnackbar("Status page updated successfully", {
        variant: "success",
      });
    } catch {
      enqueueSnackbar("Failed to update status page", { variant: "error" });
    }
  };

  if (isPending) {
    return (
      <Container breadcrumbs={breadcrumbs("Loading...")}>
        <Placeholder />
      </Container>
    );
  }

  if (error || !statusPage) {
    return (
      <Container breadcrumbs={breadcrumbs("Error")}>
        <Typography level="body-sm" color="danger">
          Error loading status page
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Status page - {statusPage.name}</title>
      </Helmet>

      <Container breadcrumbs={breadcrumbs(statusPage.name)}>
        <StatusPageForm
          mode="edit"
          initialValues={initialValues}
          submitLabel="Update status page"
          isSubmitting={isUpdating}
          onSubmit={onSubmit}
        />
        <DeleteStatusPageCard statusPage={statusPage} />
      </Container>
    </>
  );
};

export default StatusPageDetailPage;
