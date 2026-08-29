import client from "../../client";

export interface IAlertRule {
  id: number;
  name: string;
  condition: string;
  channels: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getAlertRules(teamId: number): Promise<IAlertRule[]> {
  const response = await client.get(`/v1/teams/${teamId}/alerting`);
  return response?.data;
}

export async function getAlertRule(
  teamId: number,
  ruleId: number,
): Promise<IAlertRule> {
  const response = await client.get(`/v1/teams/${teamId}/alerting/${ruleId}`);
  return response?.data;
}

export interface IPostAlertRuleRequest {
  name: string;
  condition: string;
  channels: string;
  enabled: boolean;
}

export async function createAlertRule(
  teamId: number,
  data: IPostAlertRuleRequest,
): Promise<IAlertRule> {
  const response = await client.post(`/v1/teams/${teamId}/alerting`, data);
  return response?.data;
}

export interface IPutAlertRuleRequest {
  name: string;
  condition: string;
  channels: string;
  enabled: boolean;
}

export async function updateAlertRule(
  teamId: number,
  ruleId: number,
  data: IPutAlertRuleRequest,
): Promise<IAlertRule> {
  const response = await client.put(
    `/v1/teams/${teamId}/alerting/${ruleId}`,
    data,
  );
  return response?.data;
}

export async function deleteAlertRule(
  teamId: number,
  ruleId: number,
): Promise<void> {
  await client.delete(`/v1/teams/${teamId}/alerting/${ruleId}`);
}

export interface IAlertRuleTrigger {
  id: number;
  incidentId?: number;
  channels: string;
  createdAt: string;
}

export interface GetAlertRuleTriggersResponse {
  totalCount: number;
  triggers: IAlertRuleTrigger[];
}

export async function getAlertRuleTriggers(
  teamId: number,
  ruleId: number,
  offset?: number,
  limit?: number,
): Promise<GetAlertRuleTriggersResponse> {
  const response = await client.get(
    `/v1/teams/${teamId}/alerting/${ruleId}/triggers`,
    {
      params: {
        offset,
        limit,
      },
    },
  );
  return response?.data;
}
