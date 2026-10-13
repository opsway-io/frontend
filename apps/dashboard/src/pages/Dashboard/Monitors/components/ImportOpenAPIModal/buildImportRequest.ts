import {
  CreateMonitorRequest,
  CreateMonitorsBulkRequest,
  PreviewOpenAPIEndpoint,
} from "../../../../../api/endpoints/monitors";

type ImportMonitor = CreateMonitorsBulkRequest["monitors"][number];
type ImportStep = CreateMonitorRequest["steps"][number];
type AuthMethod = CreateMonitorRequest["settings"]["auth"]["method"];

interface ImportAuth {
  method: AuthMethod;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
}

interface ImportOptions {
  endpoints: PreviewOpenAPIEndpoint[];
  /** Origin prepended to every endpoint path (paths already include the API base path). */
  baseUrl: string;
  specUrl: string;
  groupAsSingle: boolean;
  auth: ImportAuth;
  locations: string[];
}

const emptyImportAuth: ImportAuth = {
  method: "NONE",
  tokenUrl: "",
  clientId: "",
  clientSecret: "",
  username: "",
  password: "",
};

const joinUrl = (base: string, path: string) =>
  `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

/** Returns the origin of a URL, or "" when it can't be parsed. */
const getOrigin = (url?: string) => {
  if (!url) {
    return "";
  }

  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

const getEndpointLabel = (endpoint: PreviewOpenAPIEndpoint) =>
  `${endpoint.method.toUpperCase()} ${endpoint.path}`;

const getEndpointName = (endpoint: PreviewOpenAPIEndpoint) =>
  endpoint.summary || getEndpointLabel(endpoint);

const buildStep = (
  endpoint: PreviewOpenAPIEndpoint,
  baseUrl: string,
): ImportStep => ({
  name: getEndpointName(endpoint),
  method: endpoint.method.toUpperCase() as ImportStep["method"],
  url: baseUrl ? joinUrl(baseUrl, endpoint.path) : endpoint.path,
  body: {
    type: endpoint.requestBody ? "JSON" : "NONE",
    content: endpoint.requestBody || null,
  },
  assertions:
    endpoint.assertions && endpoint.assertions.length > 0
      ? endpoint.assertions
      : [
          {
            source: "STATUS_CODE",
            operator: "EQUAL",
            target: endpoint.statusCode || "200",
          },
        ],
});

const buildSettings = (options: ImportOptions): ImportMonitor["settings"] => {
  const { auth, baseUrl } = options;
  const isRelativeTokenUrl = !!baseUrl && !auth.tokenUrl.startsWith("http");

  return {
    frequencySeconds: 60,
    tls: {
      enabled: true,
      verifyHostname: true,
      checkExpiration: true,
      expirationThresholdDays: 7,
    },
    auth: {
      method: auth.method,
      tokenUrl: auth.tokenUrl
        ? isRelativeTokenUrl
          ? joinUrl(baseUrl, auth.tokenUrl)
          : auth.tokenUrl
        : undefined,
      clientId: auth.clientId || undefined,
      clientSecret: auth.clientSecret || undefined,
      username: auth.username || undefined,
      password: auth.password || undefined,
    },
    locations: options.locations.length > 0 ? options.locations : ["global"],
  };
};

/**
 * Builds the bulk create request: either one monitor per endpoint or a single
 * multi-step monitor with a step per endpoint.
 */
const buildImportRequest = (
  options: ImportOptions,
): CreateMonitorsBulkRequest => {
  const settings = buildSettings(options);

  if (options.groupAsSingle) {
    return {
      monitors: [
        {
          name: `Imported OpenAPI - ${options.baseUrl || options.specUrl}`,
          settings,
          steps: options.endpoints.map((endpoint) =>
            buildStep(endpoint, options.baseUrl),
          ),
        },
      ],
    };
  }

  return {
    monitors: options.endpoints.map((endpoint) => ({
      name: getEndpointName(endpoint),
      settings,
      steps: [buildStep(endpoint, options.baseUrl)],
    })),
  };
};

export {
  buildImportRequest,
  emptyImportAuth,
  getEndpointLabel,
  getEndpointName,
  getOrigin,
};
export type { ImportAuth };
