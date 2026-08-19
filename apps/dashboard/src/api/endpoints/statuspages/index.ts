import client from "../../client";

export interface StatusPage {
  id: number;
  name: string;
  domain: string;
  logoUrl: string;
  logoLink: string;
  faviconUrl: string;
  layout: string;
  customCss: string;
  headerHtml: string;
  footerHtml: string;
  customComponentsHtml: string;
  showBranding: boolean;
  isPrivate: boolean;
  monitorIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface GetStatusPagesResponse {
  statusPages: StatusPage[];
}

export const getStatusPages = async (
  teamId: number,
): Promise<GetStatusPagesResponse> => {
  const { data } = await client.get<GetStatusPagesResponse>(
    `/v1/teams/${teamId}/status-pages`,
  );
  return data;
};

export const getStatusPage = async (
  teamId: number,
  statusPageId: number,
): Promise<StatusPage> => {
  const { data } = await client.get<StatusPage>(
    `/v1/teams/${teamId}/status-pages/${statusPageId}`,
  );
  return data;
};

export interface PostStatusPageRequest {
  name: string;
  domain: string;
}

export const createStatusPage = async (
  teamId: number,
  payload: PostStatusPageRequest,
): Promise<StatusPage> => {
  const { data } = await client.post<StatusPage>(
    `/v1/teams/${teamId}/status-pages`,
    payload,
  );
  return data;
};

export interface PutStatusPageRequest {
  name: string;
  domain: string;
  logoUrl?: string;
  logoLink?: string;
  faviconUrl?: string;
  layout?: string;
  customCss?: string;
  headerHtml?: string;
  footerHtml?: string;
  customComponentsHtml?: string;
  showBranding?: boolean;
  isPrivate?: boolean;
  password?: string;
  monitorIds?: number[];
}

export const updateStatusPage = async (
  teamId: number,
  statusPageId: number,
  payload: PutStatusPageRequest,
): Promise<StatusPage> => {
  const { data } = await client.put<StatusPage>(
    `/v1/teams/${teamId}/status-pages/${statusPageId}`,
    payload,
  );
  return data;
};

export const deleteStatusPage = async (
  teamId: number,
  statusPageId: number,
): Promise<void> => {
  await client.delete(`/v1/teams/${teamId}/status-pages/${statusPageId}`);
};
