import { createContext, useContext } from "react";
import useSidebarStore from "../../hooks/sidebar.store";

export type SidebarVariant = "rail" | "drawer";

export const SidebarVariantContext = createContext<SidebarVariant>("rail");

/**
 * Whether the sidebar should render collapsed. The mobile drawer is always
 * expanded regardless of the persisted desktop preference.
 */
export const useSidebarCollapsed = () => {
  const variant = useContext(SidebarVariantContext);
  const { collapsed } = useSidebarStore();

  return variant === "drawer" ? false : !!collapsed;
};
