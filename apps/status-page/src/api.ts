export interface PublicMonitor {
  id: number;
  name: string;
  status: string; // "OPERATIONAL" | "OUTAGE"
}

export interface PublicIncident {
  id: number;
  title: string;
  description: string;
  monitorId: number | null;
}

export interface PublicMaintenance {
  id: number;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
}

export interface GetPublicStatusPageResponse {
  name: string;
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
  monitors: PublicMonitor[];
  activeIncidents: PublicIncident[];
  activeMaintenance: PublicMaintenance[];
  maintenanceEvents: PublicMaintenance[];
}

export const getPublicStatusPage = async (
  domain: string,
  password?: string,
): Promise<GetPublicStatusPageResponse> => {
  const headers: HeadersInit = {};
  if (password) {
    headers["X-Status-Page-Password"] = password;
  }

  const response = await fetch(
    `/v1/public/status-pages/${encodeURIComponent(domain)}`,
    { headers },
  );

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch status page for ${domain}`);
  }

  return response.json();
};

export const subscribeToStatusPage = async (
  domain: string,
  email: string,
): Promise<void> => {
  const response = await fetch(
    `/v1/public/status-pages/${encodeURIComponent(domain)}/subscribe`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to subscribe to ${domain}`);
  }
};

export const verifySubscriber = async (
  domain: string,
  token: string,
): Promise<void> => {
  const response = await fetch(
    `/v1/public/status-pages/${encodeURIComponent(domain)}/subscribe/verify/${encodeURIComponent(token)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to verify subscription for ${domain}`);
  }
};
