import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Container from "../../../../components/Container/Container";
import { useCreateMaintenanceWindow } from "../../../../hooks/maintenance.query";
import { getErrorMessage } from "../../../../utilities/errors";
import MaintenanceWindowFields from "../components/MaintenanceWindowFields";
import {
  createEmptyMaintenanceFormValues,
  MaintenanceFormValues,
} from "../maintenanceForm";

const MaintenanceCreatePage: FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createMaintenance, isPending: isCreating } =
    useCreateMaintenanceWindow();

  const [defaultValues] = useState(createEmptyMaintenanceFormValues);
  const { control, handleSubmit } = useForm<MaintenanceFormValues>({
    defaultValues,
  });

  const onSubmit = async (values: MaintenanceFormValues) => {
    try {
      await createMaintenance(values);
      enqueueSnackbar("Maintenance window scheduled successfully", {
        variant: "success",
      });
      navigate("..");
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to schedule window"), {
        variant: "error",
      });
    }
  };

  return (
    <Container
      header="Create Maintenance Window"
      breadcrumbs={[
        <Link to="/maintenance" key="maintenance">
          Maintenance
        </Link>,
        <span key="create">Create</span>,
      ]}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <MaintenanceWindowFields control={control} />
        <Stack direction="row" justifyContent="flex-end" spacing={1} mt={2}>
          <Button
            variant="outlined"
            color="neutral"
            component={Link}
            to="/maintenance"
          >
            Cancel
          </Button>
          <Button type="submit" loading={isCreating}>
            Create
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default MaintenanceCreatePage;
