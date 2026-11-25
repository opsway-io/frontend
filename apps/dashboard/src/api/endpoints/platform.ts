import client from "../client";

export type ProductSlug =
  | "monitoring"
  | "log_search"
  | "pantomath"
  | "managed_agent";

export type ProductVisibility =
  | "disabled"
  | "owner_only"
  | "targeted"
  | "enabled";

export interface PlatformProductsResponse {
  isPlatformOwner: boolean;
  products: Record<ProductSlug, boolean>;
}

export interface AllowedUserSummary {
  id: number;
  name: string;
  email: string;
}

export interface ProductFlag {
  product: ProductSlug;
  visibility: ProductVisibility;
  allowedUserIds: number[];
  allowedUsers: AllowedUserSummary[];
  allowedTeamIds: number[];
  description: string;
  updatedAt: string;
}

export interface PlatformOwner {
  id: number;
  name: string;
  displayName?: string;
  email: string;
}

export async function getPlatformProducts(
  teamId?: number | string | null,
): Promise<PlatformProductsResponse> {
  const response = await client.get("/v1/platform/products", {
    params: teamId ? { teamId } : undefined,
  });
  return response?.data;
}

export async function getAdminProductFlags(): Promise<{ flags: ProductFlag[] }> {
  const response = await client.get("/v1/platform/admin/products");
  return response?.data;
}

export async function updateAdminProductFlag(
  product: ProductSlug,
  payload: {
    visibility: ProductVisibility;
    allowedUserIds?: number[];
    allowedEmails?: string[];
    allowedTeamIds?: number[];
    description?: string;
  },
): Promise<{ flag: ProductFlag }> {
  const response = await client.put(
    `/v1/platform/admin/products/${product}`,
    payload,
  );
  return response?.data;
}

export async function getPlatformOwners(): Promise<{ owners: PlatformOwner[] }> {
  const response = await client.get("/v1/platform/admin/owners");
  return response?.data;
}

export async function addPlatformOwner(
  email: string,
): Promise<{ owner: PlatformOwner }> {
  const response = await client.post("/v1/platform/admin/owners", { email });
  return response?.data;
}

export async function removePlatformOwner(userId: number): Promise<void> {
  await client.delete(`/v1/platform/admin/owners/${userId}`);
}
