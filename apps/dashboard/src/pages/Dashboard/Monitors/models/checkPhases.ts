import { Check } from "../../../../api/endpoints/monitors/checks";

type CheckTimingKey = Exclude<keyof Check["timing"], "total">;

interface CheckPhase {
  label: string;
  /** Joy palette token, kept in sync with the response times graph. */
  color: string;
  timingKey: CheckTimingKey;
}

const checkPhases: CheckPhase[] = [
  { label: "DNS", color: "info.500", timingKey: "dnsLookup" },
  { label: "TCP", color: "success.500", timingKey: "tcpConnection" },
  { label: "TLS", color: "warning.500", timingKey: "tlsHandshake" },
  {
    label: "Processing",
    color: "semantic.reports",
    timingKey: "serverProcessing",
  },
  { label: "Transfer", color: "danger.500", timingKey: "contentTransfer" },
];

/** Check timings are reported in nanoseconds. */
const nanosecondsToMilliseconds = (nanoseconds: number) =>
  Math.floor(nanoseconds / 1000000);

const formatNanosecondsAsMilliseconds = (nanoseconds: number) =>
  `${nanosecondsToMilliseconds(nanoseconds)} ms`;

export {
  checkPhases,
  formatNanosecondsAsMilliseconds,
  nanosecondsToMilliseconds,
};
