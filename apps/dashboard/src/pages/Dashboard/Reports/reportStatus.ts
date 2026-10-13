import { ColorPaletteProp } from "@mui/joy";
import { Report } from "../../../api/endpoints/reports";

export const reportStatusColor = (
  status: Report["status"],
): ColorPaletteProp => {
  if (status === "COMPLETED") return "success";
  if (status === "FAILED") return "danger";
  return "warning";
};
