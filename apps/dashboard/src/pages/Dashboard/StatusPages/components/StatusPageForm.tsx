import { Button, Stack } from "@mui/joy";
import { FunctionComponent, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  emptyStatusPageFormValues,
  StatusPageFormValues,
} from "../statusPageForm";
import DomainSection from "./sections/DomainSection";
import EmbedsSection from "./sections/EmbedsSection";
import LookAndFeelSection from "./sections/LookAndFeelSection";
import MetaSection from "./sections/MetaSection";
import MonitorGroupsSection from "./sections/MonitorGroupsSection";
import PrivacySection from "./sections/PrivacySection";

interface StatusPageFormProps {
  /**
   * "create" only asks for the name and domain, "edit" shows every setting.
   */
  mode: "create" | "edit";
  /** Values to (re)initialize the form with, e.g. the loaded status page. */
  initialValues?: StatusPageFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: StatusPageFormValues) => void | Promise<void>;
}

const StatusPageForm: FunctionComponent<StatusPageFormProps> = ({
  mode,
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}) => {
  const { control, handleSubmit, reset } = useForm<StatusPageFormValues>({
    defaultValues: initialValues ?? emptyStatusPageFormValues,
  });

  // Re-sync with the server state whenever it changes (e.g. after saving).
  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const isEdit = mode === "edit";

  return (
    <>
      <MetaSection control={control} />
      {isEdit && <MonitorGroupsSection control={control} />}
      {isEdit && <LookAndFeelSection control={control} />}
      <DomainSection control={control} />
      {isEdit && <PrivacySection control={control} />}
      {isEdit && <EmbedsSection control={control} />}

      <Stack direction="row" justifyContent="flex-end">
        <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </>
  );
};

export default StatusPageForm;
