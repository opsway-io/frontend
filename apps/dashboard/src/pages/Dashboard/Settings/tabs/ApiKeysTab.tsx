import { Button } from "@mui/joy";
import { FunctionComponent, useState } from "react";
import { IoAdd } from "react-icons/io5";
import SettingsCard from "../../../../components/SettingsCard/SettingsCard";
import useAuthenticationStore from "../../../../hooks/authentication.store";
import ApiKeysTable from "../components/ApiKeysTable";
import CreateApiKeyDialog from "../components/CreateApiKeyDialog";

const ApiKeysTab: FunctionComponent = () => {
  const teamId = useAuthenticationStore((state) => state.currentTeamId);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <>
      <SettingsCard
        title="API Keys"
        description="Manage API keys to access Opsway programmatically or to scrape metrics using Prometheus."
        headerAction={
          <Button
            startDecorator={<IoAdd />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create new key
          </Button>
        }
      >
        <ApiKeysTable />
      </SettingsCard>

      {openCreateDialog && teamId && (
        <CreateApiKeyDialog
          teamId={teamId}
          onClose={() => setOpenCreateDialog(false)}
        />
      )}
    </>
  );
};

export default ApiKeysTab;
