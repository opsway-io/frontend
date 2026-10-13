import { describe, expect, it } from "vitest";
import { PreviewOpenAPIEndpoint } from "../../../../../api/endpoints/monitors";
import {
  buildImportRequest,
  emptyImportAuth,
  getOrigin,
} from "./buildImportRequest";

const endpoints: PreviewOpenAPIEndpoint[] = [
  { method: "get", path: "/v1/pets", summary: "List pets", statusCode: "200" },
  {
    method: "post",
    path: "v1/pets",
    summary: "",
    statusCode: "201",
    requestBody: '{"name":"rex"}',
  },
];

const baseOptions = {
  endpoints,
  baseUrl: "https://api.example.com/",
  specUrl: "https://example.com/openapi.json",
  groupAsSingle: false,
  auth: emptyImportAuth,
  locations: [],
};

describe("buildImportRequest", () => {
  it("creates one monitor per endpoint", () => {
    const request = buildImportRequest(baseOptions);

    expect(request.monitors).toHaveLength(2);
    expect(request.monitors[0].name).toBe("List pets");
    expect(request.monitors[1].name).toBe("POST v1/pets");
    expect(request.monitors[1].steps[0]).toMatchObject({
      method: "POST",
      url: "https://api.example.com/v1/pets",
      body: { type: "JSON", content: '{"name":"rex"}' },
      assertions: [{ source: "STATUS_CODE", operator: "EQUAL", target: "201" }],
    });
    expect(request.monitors[0].settings.locations).toEqual(["global"]);
  });

  it("groups endpoints into a single multi-step monitor", () => {
    const request = buildImportRequest({ ...baseOptions, groupAsSingle: true });

    expect(request.monitors).toHaveLength(1);
    expect(request.monitors[0].steps).toHaveLength(2);
    expect(request.monitors[0].name).toBe(
      "Imported OpenAPI - https://api.example.com/",
    );
  });

  it("resolves a relative token URL against the base URL", () => {
    const request = buildImportRequest({
      ...baseOptions,
      auth: {
        ...emptyImportAuth,
        method: "OAUTH2_CLIENT_CREDENTIALS",
        tokenUrl: "/oauth/token",
      },
    });

    expect(request.monitors[0].settings.auth.tokenUrl).toBe(
      "https://api.example.com/oauth/token",
    );
  });
});

describe("getOrigin", () => {
  it("returns the origin or an empty string", () => {
    expect(getOrigin("https://api.example.com/v1")).toBe(
      "https://api.example.com",
    );
    expect(getOrigin("not a url")).toBe("");
    expect(getOrigin(undefined)).toBe("");
  });
});
