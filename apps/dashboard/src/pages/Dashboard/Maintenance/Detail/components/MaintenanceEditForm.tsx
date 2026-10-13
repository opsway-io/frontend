import { Button, Stack } from "@mui/joy";
import { enqueueSnackbar } from "notistack";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { IMaintenanceWindow } from "../../../../../api/endpoints/maintenance";
import { useUpdateMaintenanceWindow } from "../../../../../hooks/maintenance.query";
import { getErrorMessage } from "../../../../../utilities/errors";
import MaintenanceWindowFields from "../../components/MaintenanceWindowFields";
import {
  MaintenanceFormValues,
  toMaintenanceFormValues,
} from "../../maintenanceForm";

interface MaintenanceEditFormProps {
  maintenanceWindow: IMaintenanceWindow;
}

const MaintenanceEditForm: FunctionComponent<MaintenanceEditFormProps> = ({
  maintenanceWindow,
}) => {
  const { mutateAsync: updateMaintenance, isPending: isUpdating } =
    useUpdateMaintenanceWindow(maintenanceWindow.id);

  const { control, handleSubmit } = useForm<MaintenanceFormValues>({
    defaultValues: toMaintenanceFormValues(maintenanceWindow),
  });

  const onSubmit = async (values: MaintenanceFormValues) => {
    try {
      await updateMaintenance(values);
      enqueueSnackbar("Maintenance window updated successfully", {
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to update window"), {
        variant: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <MaintenanceWindowFields control={control} />
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button type="submit" loading={isUpdating}>
          Save Changes
        </Button>
      </Stack>
    </form>
  );
};

export default MaintenanceEditForm;
