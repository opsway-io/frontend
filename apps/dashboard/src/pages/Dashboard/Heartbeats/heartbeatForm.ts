import { IHeartbeat } from "../../../api/endpoints/heartbeats";

export interface HeartbeatFormValues {
  name: string;
  interval: number;
  grace: number;
}

export const emptyHeartbeatFormValues: HeartbeatFormValues = {
  name: "",
  interval: 5,
  grace: 1,
};

export const toHeartbeatFormValues = ({
  name,
  interval,
  grace,
}: IHeartbeat): HeartbeatFormValues => ({ name, interval, grace });
