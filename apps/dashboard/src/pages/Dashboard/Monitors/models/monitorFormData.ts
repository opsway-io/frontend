import {
  CreateMonitorRequest,
  Monitor,
  MonitorAssertion,
} from "../../../../api/endpoints/monitors";

/** Shape of the monitor create/settings form (identical to the create request). */
type MonitorFormData = CreateMonitorRequest;

type MonitorFormStep = MonitorFormData["steps"][number];

const createDefaultAssertion = (): MonitorAssertion => ({
  source: "STATUS_CODE",
  operator: "EQUAL",
  target: "200",
});

const createDefaultStep = (stepNumber: number): MonitorFormStep => ({
  name: `Step ${stepNumber}`,
  method: "GET",
  url: "",
  headers: [],
  body: {
    type: "NONE",
    content: null,
  },
  assertions: [createDefaultAssertion()],
  variables: [],
});

const createDefaultMonitorFormValues = (teamId: number): MonitorFormData => ({
  teamId,
  name: "",
  steps: [createDefaultStep(1)],
  settings: {
    tls: {
      enabled: true,
      verifyHostname: true,
      checkExpiration: true,
      expirationThresholdDays: 7,
    },
    frequencySeconds: 300,
    locations: ["global"],
    auth: {
      method: "NONE",
    },
  },
});

/** Form values for editing an existing monitor. */
const monitorToFormData = (
  monitor: Monitor,
  teamId: number,
): MonitorFormData => ({
  teamId,
  name: monitor.name,
  settings: monitor.settings,
  steps: monitor.steps,
});

export { createDefaultMonitorFormValues, createDefaultStep, monitorToFormData };
export type { MonitorFormData };
