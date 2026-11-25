import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthenticationStore from "./authentication.store";
import {
  addPlatformOwner,
  getAdminProductFlags,
  getPlatformOwners,
  getPlatformProducts,
  ProductSlug,
  ProductVisibility,
  removePlatformOwner,
  updateAdminProductFlag,
} from "../api/endpoints/platform";

export function usePlatformProducts() {
  const currentTeamId = useAuthenticationStore((s) => s.currentTeamId);
  const isAuthenticated = useAuthenticationStore((s) => s.isAuthenticated());

  return useQuery({
    queryKey: ["platform", "products", currentTeamId],
    queryFn: () => getPlatformProducts(currentTeamId),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useIsPlatformOwner(): boolean {
  const { data } = usePlatformProducts();
  return data?.isPlatformOwner ?? false;
}

export function useIsProductEnabled(product?: ProductSlug): boolean {
  const { data } = usePlatformProducts();
  if (!product) return true;
  if (!data?.products) return true;
  return data.products[product] !== false;
}

export function useAdminProductFlags(enabled = true) {
  return useQuery({
    queryKey: ["platform", "admin", "flags"],
    queryFn: getAdminProductFlags,
    enabled,
  });
}

export function useUpdateAdminProductFlag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      product,
      visibility,
      allowedUserIds,
      allowedEmails,
      allowedTeamIds,
      description,
    }: {
      product: ProductSlug;
      visibility: ProductVisibility;
      allowedUserIds?: number[];
      allowedEmails?: string[];
      allowedTeamIds?: number[];
      description?: string;
    }) =>
      updateAdminProductFlag(product, {
        visibility,
        allowedUserIds,
        allowedEmails,
        allowedTeamIds,
        description,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}

export function usePlatformOwners(enabled = true) {
  return useQuery({
    queryKey: ["platform", "admin", "owners"],
    queryFn: getPlatformOwners,
    enabled,
  });
}

export function useAddPlatformOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (email: string) => addPlatformOwner(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}

export function useRemovePlatformOwner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => removePlatformOwner(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platform"] });
    },
  });
}
