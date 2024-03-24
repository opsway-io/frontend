import {
  CreateMonitorRequest,
  MonitorAssertion,
} from "../../../../api/endpoints/monitors";

interface SettingsFormData extends CreateMonitorRequest {
  assertions: (MonitorAssertion & {
    key: string;
  })[];
}

export type { SettingsFormData };
