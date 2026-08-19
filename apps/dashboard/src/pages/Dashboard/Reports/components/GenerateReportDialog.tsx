import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateReport } from "../../../../hooks/reports.query";
import { IPostReportRequest } from "../../../../api/endpoints/reports";
import { enqueueSnackbar } from "notistack";
import moment from "moment";

export interface GenerateReportDialogProps {
  open: boolean;
  onClose: () => void;
  defaultReportType?: IPostReportRequest["reportType"];
}

const GenerateReportDialog: FunctionComponent<GenerateReportDialogProps> = ({
  open,
  onClose,
  defaultReportType = "UPTIME",
}) => {
  const { mutateAsync: createReport, isLoading } = useCreateReport();

  const { control, handleSubmit, reset } = useForm<IPostReportRequest>({
    defaultValues: {
      reportType: defaultReportType,
      start: moment().subtract(1, "months").format("YYYY-MM-DD"),
      end: moment().format("YYYY-MM-DD"),
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        reportType: defaultReportType,
        start: moment().subtract(1, "months").format("YYYY-MM-DD"),
        end: moment().format("YYYY-MM-DD"),
      });
    }
  }, [open, defaultReportType, reset]);

  const onSubmit = async (data: IPostReportRequest) => {
    try {
      // Ensure ISO string for dates if required, or keep YYYY-MM-DD based on API preference.
      await createReport({
        ...data,
        start: moment(data.start).startOf("day").toISOString(),
        end: moment(data.end).endOf("day").toISOString(),
      });
      enqueueSnackbar("Report generated successfully", { variant: "success" });
      onClose();
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to generate report", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Generate Report</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Generate a new report for the specified date range. The report will
            be available in the previous reports list shortly.
          </DialogContentText>
          <Stack spacing={3}>
            <Controller
              name="reportType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Report Type"
                  fullWidth
                  disabled={
                    defaultReportType !== "CUSTOM" &&
                    defaultReportType !== "UPTIME"
                  } // Allow changing if they clicked custom
                >
                  <MenuItem value="UPTIME">Uptime overview</MenuItem>
                  <MenuItem value="PERFORMANCE">Performance overview</MenuItem>
                  <MenuItem value="INCIDENT">Incident overview</MenuItem>
                  <MenuItem value="ALL">All in!</MenuItem>
                  <MenuItem value="CUSTOM">Custom report</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="start"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <Controller
              name="end"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default GenerateReportDialog;
