import { ReactNode } from "react";
import {
  IoAlertCircleOutline,
  IoLayersOutline,
  IoOptionsOutline,
  IoPulseOutline,
  IoSpeedometerOutline,
} from "react-icons/io5";
import { IPostReportRequest } from "../../../api/endpoints/reports";

export type ReportType = IPostReportRequest["reportType"];

export interface ReportTypeOption {
  type: ReportType;
  title: string;
  description: string;
  icon: ReactNode;
}

export const reportTypes: ReportTypeOption[] = [
  {
    type: "UPTIME",
    title: "Uptime overview",
    description: "An overview of uptime across all your monitors.",
    icon: <IoPulseOutline />,
  },
  {
    type: "PERFORMANCE",
    title: "Performance overview",
    description: "An overview of response time across all your monitors.",
    icon: <IoSpeedometerOutline />,
  },
  {
    type: "INCIDENT",
    title: "Incident Overview",
    description: "An overview of incidents across all your monitors.",
    icon: <IoAlertCircleOutline />,
  },
  {
    type: "ALL",
    title: "All in!",
    description: "A report with all the information you need.",
    icon: <IoLayersOutline />,
  },
  {
    type: "CUSTOM",
    title: "Custom report",
    description: "A report tailored with the information you specify.",
    icon: <IoOptionsOutline />,
  },
];
