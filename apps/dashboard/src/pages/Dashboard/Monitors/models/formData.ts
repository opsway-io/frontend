import {
  CreateMonitorRequest,
  MonitorAssertion,
} from "../../../../api/endpoints/monitors";

interface FormData extends CreateMonitorRequest {
  assertions: (MonitorAssertion & {
    key: string;
  })[];
}

export type { FormData };
