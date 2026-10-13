import { Button, Input, Stack } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MonitorFormData } from "../../models/monitorFormData";

interface MonitorFormHeaderProps {
  submitLabel: ReactNode;
  submitIcon?: ReactNode;
  submitting: boolean;
  submitDisabled: boolean;
  onSubmit: () => void;
}

/** Monitor name input next to the submit button. */
const MonitorFormHeader: FunctionComponent<MonitorFormHeaderProps> = (
  props,
) => {
  const { control } = useFormContext<MonitorFormData>();

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <Stack flex="1">
        <Controller
          name="name"
          control={control}
          rules={{ required: true, maxLength: 100 }}
          render={({ field }) => (
            <Input
              placeholder="Monitor name"
              aria-label="Monitor name"
              size="md"
              {...field}
            />
          )}
        />
      </Stack>

      <Button
        size="md"
        type="submit"
        loading={props.submitting}
        disabled={props.submitDisabled || props.submitting}
        onClick={props.onSubmit}
        loadingPosition={props.submitIcon ? "end" : undefined}
        endDecorator={props.submitIcon}
      >
        {props.submitLabel}
      </Button>
    </Stack>
  );
};

export default MonitorFormHeader;
