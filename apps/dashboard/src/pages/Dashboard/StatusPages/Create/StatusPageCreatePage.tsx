import { isAxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import UpgradePromptModal from "../../../../components/UpgradePromptModal/UpgradePromptModal";
import { useCreateStatusPage } from "../../../../hooks/statuspages.query";
import StatusPageForm from "../components/StatusPageForm";
import { StatusPageFormValues } from "../statusPageForm";

const StatusPageCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createStatusPage, isPending: isCreating } =
    useCreateStatusPage();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const onSubmit = async ({ name, domain }: StatusPageFormValues) => {
    try {
      const statusPage = await createStatusPage({ name, domain });
      enqueueSnackbar("Status page created successfully", {
        variant: "success",
      });
      navigate(`/status-pages/${statusPage.id}`);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 402) {
        setUpgradeModalOpen(true);
      } else {
        enqueueSnackbar("Failed to create status page", { variant: "error" });
      }
    }
  };

  return (
    <>
      <UpgradePromptModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        featureName="Status Pages"
      />
      <Helmet>
        <title>Status pages</title>
      </Helmet>

      <Container
        breadcrumbs={[
          <Link key="status-pages" to="/status-pages">
            Status pages
          </Link>,
          <span key="create">Create</span>,
        ]}
      >
        <StatusPageForm
          mode="create"
          submitLabel="Create status page"
          isSubmitting={isCreating}
          onSubmit={onSubmit}
        />
      </Container>
    </>
  );
};

export default StatusPageCreatePage;
