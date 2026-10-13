import { EscalationPolicy } from "../../../api/endpoints/teams";

export interface EscalationFormValues {
  name: string;
  escalationTimeoutMinutes: number;
  enforcedChannel: string;
  rotations: { userId: number; tier: number }[];
}

export const MAX_ESCALATION_TIMEOUT_MINUTES = 1440;
export const ESCALATION_TIERS = [1, 2, 3, 4, 5];

export const toEscalationFormValues = (
  policy: EscalationPolicy | null | undefined,
): EscalationFormValues => ({
  name: policy?.name ?? "",
  escalationTimeoutMinutes: policy?.escalationTimeoutMinutes ?? 15,
  enforcedChannel: policy?.enforcedChannel ?? "",
  rotations: policy?.rotations ?? [],
});
