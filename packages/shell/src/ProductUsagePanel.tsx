"use client";

import React from "react";

export type BillingProductSlug =
  | "monitoring"
  | "log_search"
  | "pantomath"
  | "managed_agent";

export type BillingEntitlementTier = "FREE" | "PRO" | "ENTERPRISE";

export interface ShellQuotaItem {
  key: string;
  label: string;
  used: number;
  limit: number; // -1 means unlimited
  unit: string;
  percent: number;
  projected?: number;
  status: "ok" | "warning" | "critical" | "unlimited";
}

export interface ShellEnforcementSummary {
  product: BillingProductSlug;
  quotaKey: string;
  label: string;
  state: "NORMAL" | "WARNING" | "GRACE" | "OVERAGE_BILLING" | "THROTTLED";
  used: number;
  limit: number;
  unit: string;
  percent: number;
  graceHoursRemaining?: number;
  behaviorSummary?: string;
}

export interface ShellTeamEntitlement {
  id: number;
  teamId: number;
  product: BillingProductSlug;
  tier: BillingEntitlementTier;
  source?: "SUITE" | "ADDON";
  enabled: boolean;
  monthlyQuota: number;
  currentUsage: number;
  usageResetAt?: string;
}

export interface ShellTeamSubscription {
  stripeSubscriptionId?: string;
  baseTier: BillingEntitlementTier;
  status: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface ShellCatalogAddonTier {
  tier: BillingEntitlementTier;
  name: string;
  price: number;
  currency: string;
  lookupKey: string;
  monthlyQuota: number;
  quotaUnit: string;
}

export interface ShellCatalogProductAddon {
  product: BillingProductSlug;
  name: string;
  description: string;
  subdomain: string;
  tiers: ShellCatalogAddonTier[];
}

export interface ShellStatItem {
  label: string;
  value: string | number;
}

export interface ProductUsageCardProps {
  product: BillingProductSlug;
  title: string;
  description: string;
  accentColor?: string;
  entitlement?: ShellTeamEntitlement;
  quotas: ShellQuotaItem[];
  stats?: ShellStatItem[];
  enforcement?: ShellEnforcementSummary;
  addonCatalog?: ShellCatalogProductAddon;
  canManageBilling?: boolean;
  isBusy?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
  onSelectAddonTier?: (tier: BillingEntitlementTier) => void;
}

export interface ProductBillingShellProps {
  product: BillingProductSlug;
  title: string;
  description: string;
  accentColor?: string;
  teamPlan: string;
  subscription?: ShellTeamSubscription | null;
  entitlement?: ShellTeamEntitlement;
  quotas: ShellQuotaItem[];
  stats?: ShellStatItem[];
  enforcement?: ShellEnforcementSummary;
  addonCatalog?: ShellCatalogProductAddon;
  canManageBilling?: boolean;
  isBusy?: boolean;
  hubBillingUrl?: string;
  hubUsageUrl?: string;
  onToggleEnabled?: (enabled: boolean) => void;
  onSelectAddonTier?: (tier: BillingEntitlementTier) => void;
  onOpenCustomerPortal?: () => void;
  onResumeSubscription?: () => void;
}

const SURFACE = {
  cardBg: "#1d2128",
  nestedBg: "#161920",
  border: "rgba(255, 255, 255, 0.09)",
  textPrimary: "#e7e9ee",
  textSecondary: "#a3aab7",
  textTertiary: "#7c8494",
};

function formatQuotaUsed(used: number, unit: string): string {
  if (unit === "GB" && used > 0 && used < 0.1) {
    const mb = used * 1024;
    if (mb >= 1) return `${mb.toFixed(1)} MB`;
    return `${(mb * 1024).toFixed(0)} KB`;
  }
  return `${used.toLocaleString()} ${unit}`;
}

function formatDateShort(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function statusPalette(status: ShellQuotaItem["status"]): {
  bar: string;
  chipBg: string;
  chipFg: string;
} {
  switch (status) {
    case "critical":
      return {
        bar: "#ef4444",
        chipBg: "rgba(239, 68, 68, 0.16)",
        chipFg: "#fca5a5",
      };
    case "warning":
      return {
        bar: "#f59e0b",
        chipBg: "rgba(245, 158, 11, 0.16)",
        chipFg: "#fcd34d",
      };
    case "unlimited":
      return {
        bar: "#64748b",
        chipBg: "rgba(148, 163, 184, 0.14)",
        chipFg: "#cbd5e1",
      };
    default:
      return {
        bar: "#3b82f6",
        chipBg: "rgba(59, 130, 246, 0.16)",
        chipFg: "#93c5fd",
      };
  }
}

function enforcementBadge(e?: ShellEnforcementSummary): {
  label: string;
  bg: string;
  fg: string;
} | null {
  if (!e) return null;
  switch (e.state) {
    case "THROTTLED":
      return {
        label: "Protection Mode",
        bg: "rgba(239, 68, 68, 0.18)",
        fg: "#fca5a5",
      };
    case "GRACE":
      return {
        label:
          e.graceHoursRemaining !== undefined
            ? `Grace (${e.graceHoursRemaining}h left)`
            : "Grace Period",
        bg: "rgba(245, 158, 11, 0.18)",
        fg: "#fcd34d",
      };
    case "OVERAGE_BILLING":
      return {
        label: "Pay-As-You-Go",
        bg: "rgba(59, 130, 246, 0.18)",
        fg: "#93c5fd",
      };
    case "WARNING":
      return {
        label: "Warning (80%+)",
        bg: "rgba(245, 158, 11, 0.16)",
        fg: "#fcd34d",
      };
    default:
      return {
        label: "Healthy",
        bg: "rgba(34, 197, 94, 0.16)",
        fg: "#86efac",
      };
  }
}

function tierRank(t: BillingEntitlementTier): number {
  return t === "ENTERPRISE" ? 2 : t === "PRO" ? 1 : 0;
}

interface ProductPlanCardDef {
  tier: BillingEntitlementTier;
  name: string;
  price: number;
  summary: string;
}

const DEFAULT_PRODUCT_PLANS: Record<BillingProductSlug, ProductPlanCardDef[]> = {
  monitoring: [
    { tier: "FREE", name: "Free", price: 0, summary: "5 monitors · 1 status page · 60s checks" },
    { tier: "PRO", name: "Monitoring Pro", price: 9, summary: "50 monitors · 5 status pages · 30s checks" },
    { tier: "ENTERPRISE", name: "Monitoring Enterprise", price: 39, summary: "Unlimited monitors & status pages · 10s checks" },
  ],
  log_search: [
    { tier: "FREE", name: "Free", price: 0, summary: "1 GB / month log ingestion · SQL & semantic search" },
    { tier: "PRO", name: "Log Search Pro", price: 12, summary: "50 GB / month ingestion · pay-as-you-go overage" },
    { tier: "ENTERPRISE", name: "Log Search Enterprise", price: 49, summary: "Unlimited ingestion · custom retention" },
  ],
  pantomath: [
    { tier: "FREE", name: "Free", price: 0, summary: "1 indexed repository · 25k vector chunks" },
    { tier: "PRO", name: "Agent Context Pro", price: 12, summary: "5 indexed repositories · 250k vector chunks" },
    { tier: "ENTERPRISE", name: "Agent Context Enterprise", price: 49, summary: "Unlimited repositories & GraphRAG chunks" },
  ],
  managed_agent: [
    { tier: "FREE", name: "Free", price: 0, summary: "3 Managed AI runs / mo · Unlimited BYOA" },
    { tier: "PRO", name: "Autonomous Agents Pro", price: 15, summary: "30 Managed AI runs / mo · 1-click remediation" },
    { tier: "ENTERPRISE", name: "Autonomous Agents Enterprise", price: 59, summary: "500 Managed AI runs / mo · Auto-remediation" },
  ],
};

function buildProductPlans(
  product: BillingProductSlug,
  addonCatalog?: ShellCatalogProductAddon,
): ProductPlanCardDef[] {
  const defaults = DEFAULT_PRODUCT_PLANS[product];
  if (!addonCatalog?.tiers?.length) return defaults;
  return defaults.map((def) => {
    const match = addonCatalog.tiers.find((t) => t.tier === def.tier);
    if (!match) return def;
    return {
      ...def,
      name: match.name || def.name,
      price: match.price,
    };
  });
}

/**
 * Framework-agnostic product usage, quota & add-on card shared across all
 * Opsway product sites (Vite/MUI Joy dashboard and Next.js/MUI Material log-search).
 */
export function ProductUsageCard({
  title,
  description,
  accentColor = "#6ba0c2",
  entitlement,
  quotas,
  stats,
  enforcement,
  addonCatalog,
  canManageBilling = false,
  isBusy = false,
  onToggleEnabled,
  onSelectAddonTier,
}: ProductUsageCardProps) {
  const tier = entitlement?.tier ?? "FREE";
  const source = entitlement?.source ?? "SUITE";
  const enabled = entitlement?.enabled ?? true;
  const resetDate = formatDateShort(entitlement?.usageResetAt);
  const badge = enforcementBadge(enforcement);

  const availableUpgrades = (addonCatalog?.tiers ?? []).filter(
    (t) => tierRank(t.tier) > tierRank(tier),
  );

  return (
    <div
      style={{
        background: SURFACE.cardBg,
        border: `1px solid ${SURFACE.border}`,
        borderRadius: 12,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        color: SURFACE.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: accentColor,
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 16, fontWeight: 600 }}>{title}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 999,
                background:
                  source === "ADDON"
                    ? "rgba(168, 113, 183, 0.2)"
                    : "rgba(107, 160, 194, 0.18)",
                color: source === "ADDON" ? "#d8b4fe" : "#93c5fd",
              }}
            >
              {tier} • {source === "ADDON" ? "Add-on" : "Suite"}
            </span>
            {badge && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: badge.bg,
                  color: badge.fg,
                }}
              >
                {badge.label}
              </span>
            )}
            {!enabled && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(148, 163, 184, 0.16)",
                  color: "#cbd5e1",
                }}
              >
                Disabled
              </span>
            )}
          </div>
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 13,
              color: SURFACE.textSecondary,
              lineHeight: 1.45,
            }}
          >
            {description}
          </p>
        </div>

        {onToggleEnabled && (
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: SURFACE.textSecondary,
              cursor: isBusy ? "not-allowed" : "pointer",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              checked={enabled}
              disabled={isBusy}
              onChange={(e) => onToggleEnabled(e.target.checked)}
              style={{ accentColor }}
            />
            <span>{enabled ? "Enabled" : "Disabled"}</span>
          </label>
        )}
      </div>

      {/* Quotas & Progress Bars */}
      {quotas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {quotas.map((q) => {
            const isUnlimited = q.status === "unlimited" || q.limit < 0;
            const pct = Math.min(100, Math.max(0, q.percent));
            const colors = statusPalette(q.status);
            return (
              <div key={q.key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: SURFACE.textSecondary }}>{q.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600 }}>
                      {formatQuotaUsed(q.used, q.unit)}
                      {!isUnlimited && ` / ${q.limit.toLocaleString()} ${q.unit}`}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "1px 7px",
                        borderRadius: 999,
                        background: colors.chipBg,
                        color: colors.chipFg,
                      }}
                    >
                      {isUnlimited ? "Unlimited" : `${Math.round(q.percent)}%`}
                    </span>
                  </div>
                </div>
                {!isUnlimited && (
                  <div
                    style={{
                      height: 6,
                      width: "100%",
                      borderRadius: 999,
                      background: "rgba(255, 255, 255, 0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: 999,
                        background: colors.bar,
                        transition: "width 200ms ease",
                      }}
                    />
                  </div>
                )}
                {q.projected !== undefined && !isUnlimited && (
                  <span style={{ fontSize: 11, color: SURFACE.textTertiary }}>
                    Projected end-of-cycle: {q.projected.toLocaleString()} {q.unit}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary Stats Grid */}
      {stats && stats.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 8,
          }}
        >
          {stats.map((st) => (
            <div
              key={st.label}
              style={{
                background: SURFACE.nestedBg,
                border: `1px solid ${SURFACE.border}`,
                borderRadius: 8,
                padding: "8px 10px",
              }}
            >
              <div style={{ fontSize: 11, color: SURFACE.textTertiary }}>{st.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
                {typeof st.value === "number" ? st.value.toLocaleString() : st.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Reset Date & Modular Add-on Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
          paddingTop: 8,
          borderTop: `1px solid ${SURFACE.border}`,
        }}
      >
        <span style={{ fontSize: 12, color: SURFACE.textTertiary }}>
          {resetDate ? `Monthly quota resets ${resetDate}` : "Monthly billing cycle"}
        </span>

        {onSelectAddonTier && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {availableUpgrades.map((up) => (
              <button
                key={up.tier}
                type="button"
                disabled={!canManageBilling || isBusy}
                title={
                  canManageBilling
                    ? `Add ${up.name} (€${up.price}/mo)`
                    : "Only team owners can change billing plans"
                }
                onClick={() => onSelectAddonTier(up.tier)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1px solid ${accentColor}`,
                  background: "rgba(255, 255, 255, 0.04)",
                  color: SURFACE.textPrimary,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: !canManageBilling || isBusy ? "not-allowed" : "pointer",
                  opacity: !canManageBilling || isBusy ? 0.55 : 1,
                }}
              >
                Upgrade to {up.tier === "PRO" ? "Pro" : "Enterprise"} (€{up.price}/mo)
              </button>
            ))}
            {source === "ADDON" && (
              <button
                type="button"
                disabled={!canManageBilling || isBusy}
                title={
                  canManageBilling
                    ? "Remove this product add-on"
                    : "Only team owners can change billing plans"
                }
                onClick={() => onSelectAddonTier("FREE")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: `1px solid ${SURFACE.border}`,
                  background: "transparent",
                  color: SURFACE.textSecondary,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: !canManageBilling || isBusy ? "not-allowed" : "pointer",
                  opacity: !canManageBilling || isBusy ? 0.55 : 1,
                }}
              >
                Remove Add-on
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Product-scoped billing & usage shell rendered on standalone product subdomains
 * (monitoring.opsway.eu, logs.opsway.eu, agent-context.opsway.eu).
 * Shows ONLY this product's usage, quotas, and add-on controls plus a link to
 * my.opsway.eu for the full cross-product Opsway Suite overview.
 */
export function ProductBillingShell({
  product,
  title,
  description,
  accentColor,
  teamPlan,
  subscription,
  entitlement,
  quotas,
  stats,
  enforcement,
  addonCatalog,
  canManageBilling = false,
  isBusy = false,
  hubBillingUrl = "https://my.opsway.eu/settings/billing",
  hubUsageUrl = "https://my.opsway.eu/settings/usage",
  onToggleEnabled,
  onSelectAddonTier,
  onOpenCustomerPortal,
  onResumeSubscription,
}: ProductBillingShellProps) {
  const isCanceling = Boolean(subscription?.cancelAtPeriodEnd);
  const isPastDue = subscription?.status === "past_due";
  const periodEnd = formatDateShort(subscription?.currentPeriodEnd);
  const activeTier: BillingEntitlementTier = entitlement?.tier ?? "FREE";
  const productPlans = buildProductPlans(product, addonCatalog);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        color: SURFACE.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
            {title} — Billing &amp; Usage
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: SURFACE.textSecondary }}>
            Current {title} tier: <strong>{activeTier}</strong>
            {entitlement?.source === "ADDON"
              ? " (Product Add-on)"
              : ` (via ${teamPlan} Suite)`}
            . Manage {title} plan and quotas below.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {onOpenCustomerPortal && (teamPlan !== "FREE" || activeTier !== "FREE") && (
            <button
              type="button"
              disabled={!canManageBilling || isBusy}
              onClick={onOpenCustomerPortal}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: `1px solid ${SURFACE.border}`,
                background: SURFACE.cardBg,
                color: SURFACE.textPrimary,
                fontSize: 13,
                fontWeight: 500,
                cursor: !canManageBilling || isBusy ? "not-allowed" : "pointer",
                opacity: !canManageBilling || isBusy ? 0.55 : 1,
              }}
            >
              Billing Portal ↗
            </button>
          )}
          <a
            href={hubBillingUrl}
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: `1px solid ${SURFACE.border}`,
              background: "rgba(107, 160, 194, 0.14)",
              color: "#93c5fd",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            All Product Billings in Hub ↗
          </a>
        </div>
      </div>

      {/* Subscription Lifecycle Banners */}
      {isPastDue && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(239, 68, 68, 0.14)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#fca5a5",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>
            Payment past due. Update your payment method in the billing portal to avoid
            service downgrade.
          </span>
          {onOpenCustomerPortal && canManageBilling && (
            <button
              type="button"
              onClick={onOpenCustomerPortal}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                background: "#ef4444",
                color: "#fff",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Update Payment Method
            </button>
          )}
        </div>
      )}

      {isCanceling && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            background: "rgba(245, 158, 11, 0.14)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            color: "#fcd34d",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span>
            Your subscription is scheduled to cancel
            {periodEnd ? ` on ${periodEnd}` : " at the end of the current period"}.
          </span>
          {onResumeSubscription && canManageBilling && (
            <button
              type="button"
              disabled={isBusy}
              onClick={onResumeSubscription}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                border: "none",
                background: "#f59e0b",
                color: "#111827",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Resume Subscription
            </button>
          )}
        </div>
      )}

      {/* Product-Specific Plans Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {productPlans.map((plan) => {
          const isCurrent = activeTier === plan.tier;
          const canSelect =
            Boolean(onSelectAddonTier) &&
            canManageBilling &&
            !isBusy &&
            !isCurrent &&
            (plan.tier !== "FREE" || entitlement?.source === "ADDON");
          return (
            <div
              key={plan.tier}
              style={{
                background: SURFACE.cardBg,
                border: `1px solid ${isCurrent ? accentColor || "#6ba0c2" : SURFACE.border}`,
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{plan.name}</span>
                  {isCurrent && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(34, 197, 94, 0.16)",
                        color: "#86efac",
                      }}
                    >
                      Current
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 700 }}>€{plan.price}</span>
                  <span style={{ fontSize: 12, color: SURFACE.textTertiary }}>/ month</span>
                </div>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 12,
                    color: SURFACE.textSecondary,
                    lineHeight: 1.45,
                  }}
                >
                  {plan.summary}
                </p>
              </div>
              {onSelectAddonTier && (
                <button
                  type="button"
                  disabled={!canSelect}
                  title={
                    isCurrent
                      ? "Current plan"
                      : !canManageBilling
                        ? "Only team owners can change billing plans"
                        : plan.tier === "FREE" && entitlement?.source !== "ADDON"
                          ? "Managed via Opsway Suite plan in Hub"
                          : `Select ${plan.name}`
                  }
                  onClick={() => onSelectAddonTier(plan.tier)}
                  style={{
                    width: "100%",
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: `1px solid ${isCurrent ? SURFACE.border : accentColor || "#6ba0c2"}`,
                    background: isCurrent
                      ? "rgba(255, 255, 255, 0.04)"
                      : accentColor || "#5185a5",
                    color: isCurrent ? SURFACE.textSecondary : "#0f1419",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: canSelect ? "pointer" : "not-allowed",
                    opacity: canSelect || isCurrent ? 1 : 0.5,
                  }}
                >
                  {isCurrent
                    ? "Current plan"
                    : plan.tier === "FREE"
                      ? "Remove add-on"
                      : `Select ${plan.tier === "PRO" ? "Pro" : "Enterprise"}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Single Product Usage & Quota Card */}
      <ProductUsageCard
        product={product}
        title={title}
        description={description}
        accentColor={accentColor}
        entitlement={entitlement}
        quotas={quotas}
        stats={stats}
        enforcement={enforcement}
        addonCatalog={addonCatalog}
        canManageBilling={canManageBilling}
        isBusy={isBusy}
        onToggleEnabled={onToggleEnabled}
        onSelectAddonTier={onSelectAddonTier}
      />

      {/* Cross-Product Hub Pointer */}
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 10,
          background: SURFACE.nestedBg,
          border: `1px solid ${SURFACE.border}`,
          fontSize: 13,
          color: SURFACE.textSecondary,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>
          This view is scoped to <strong>{title}</strong>. For cross-product Suite plans
          and whole-platform usage across all Opsway products, visit the Opsway Hub.
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <a
            href={hubUsageUrl}
            style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 500 }}
          >
            Platform Usage Overview ↗
          </a>
          <a
            href={hubBillingUrl}
            style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 500 }}
          >
            Suite Plans ↗
          </a>
        </div>
      </div>
    </div>
  );
}
