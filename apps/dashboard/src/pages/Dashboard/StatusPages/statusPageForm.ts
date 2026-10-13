import { StatusPage } from "../../../api/endpoints/statuspages";

export interface StatusPageFormValues {
  name: string;
  domain: string;
  logoUrl: string;
  logoLink: string;
  faviconUrl: string;
  layout: string;
  monitorIds: number[];
  groups: {
    name: string;
    container?: string;
    order: number;
    monitorIds: number[];
  }[];
  customCss: string;
  headerHtml: string;
  footerHtml: string;
  customComponentsHtml: string;
  showBranding: boolean;
  isPrivate: boolean;
  supportUrl: string;
  password?: string;
}

export const DEFAULT_LAYOUT = "STATS";

export const emptyStatusPageFormValues: StatusPageFormValues = {
  name: "",
  domain: "",
  logoUrl: "",
  logoLink: "",
  faviconUrl: "",
  layout: DEFAULT_LAYOUT,
  monitorIds: [],
  groups: [],
  customCss: "",
  headerHtml: "",
  footerHtml: "",
  customComponentsHtml: "",
  showBranding: true,
  isPrivate: false,
  supportUrl: "",
  password: "",
};

export const toStatusPageFormValues = (
  statusPage: StatusPage,
): StatusPageFormValues => ({
  name: statusPage.name,
  domain: statusPage.domain,
  logoUrl: statusPage.logoUrl || "",
  logoLink: statusPage.logoLink || "",
  faviconUrl: statusPage.faviconUrl || "",
  layout: statusPage.layout || DEFAULT_LAYOUT,
  monitorIds: statusPage.monitorIds || [],
  groups: statusPage.groups || [],
  customCss: statusPage.customCss || "",
  headerHtml: statusPage.headerHtml || "",
  footerHtml: statusPage.footerHtml || "",
  customComponentsHtml: statusPage.customComponentsHtml || "",
  showBranding: statusPage.showBranding ?? true,
  isPrivate: statusPage.isPrivate || false,
  supportUrl: statusPage.supportUrl || "",
  password: "",
});
