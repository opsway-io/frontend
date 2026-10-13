import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { FunctionComponent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateReport } from "../../../../hooks/reports.query";
import { IPostReportRequest } from "../../../../api/endpoints/reports";
import { enqueueSnackbar } from "notistack";
import moment from "moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
} from "../../../../components/Dialog/Dialog";
import { getErrorMessage } from "../../../../utilities/errors";
import { ReportType } from "../reportTypes";

interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
  defaultReportType?: ReportType;
}

/** The last month up to today. */
const defaultValues = (reportType: ReportType): IPostReportRequest => ({
  reportType,
  start: moment().subtract(1, "months").format("YYYY-MM-DD"),
  end: moment().format("YYYY-MM-DD"),
});

const GenerateReportDialog: FunctionComponent<GenerateReportDialogProps> = ({
  open,
  onClose,
  defaultReportType = "UPTIME",
}) => {
  const { mutateAsync: createReport, isPending: isLoading } = useCreateReport();

  const { control, handleSubmit, reset } = useForm<IPostReportRequest>({
    defaultValues: defaultValues(defaultReportType),
  });

  useEffect(() => {
    if (open) {
      reset(defaultValues(defaultReportType));
    }
  }, [open, defaultReportType, reset]);

  // The type is fixed when picked from a specific (non uptime) report card.
  const canChangeType =
    defaultReportType === "CUSTOM" || defaultReportType === "UPTIME";

  const onSubmit = async (data: IPostReportRequest) => {
    try {
      await createReport({
        ...data,
        start: moment(data.start).startOf("day").toISOString(),
        end: moment(data.end).endOf("day").toISOString(),
      });
      enqueueSnackbar("Report generated successfully", { variant: "success" });
      onClose();
    } catch (err) {
      enqueueSnackbar(getErrorMessage(err, "Failed to generate report"), {
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Generate Report" maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Typography level="body-sm" textColor="text.secondary" sx={{ mb: 2 }}>
            Generate a new report for the specified date range. The report will
            be available in the previous reports list shortly.
          </Typography>
          <Stack spacing={2}>
            <Controller
              name="reportType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <FormControl required disabled={!canChangeType}>
                  <FormLabel>Report Type</FormLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onChange={(_, value) => field.onChange(value)}
                    onBlur={field.onBlur}
                  >
                    <Option value="UPTIME">Uptime overview</Option>
                    <Option value="PERFORMANCE">Performance overview</Option>
                    <Option value="INCIDENT">Incident overview</Option>
                    <Option value="ALL">All in!</Option>
                    <Option value="CUSTOM">Custom report</Option>
                  </Select>
                </FormControl>
              )}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Controller
                name="start"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl required sx={{ flex: 1 }}>
                    <FormLabel>Start Date</FormLabel>
                    <Input {...field} type="date" />
                  </FormControl>
                )}
              />

              <Controller
                name="end"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl required sx={{ flex: 1 }}>
                    <FormLabel>End Date</FormLabel>
                    <Input {...field} type="date" />
                  </FormControl>
                )}
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            variant="plain"
            color="neutral"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            Generate
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GenerateReportDialog;
