"use client";

import React, { useEffect, useRef, useState } from "react";
import { getAppMeta, OpswayAppId, SUITE_APPS } from "./apps";
import {
  AppsGridIcon,
  BookGuideIcon,
  CheckIcon,
  ChevronDownIcon,
  LogInIcon,
  LogOutIcon,
  MenuHamburgerIcon,
  PlusIcon,
  SettingsIcon,
  SuiteAppIcon,
} from "./icons";

export interface OpswayTeamOption {
  id: number | string;
  name: string;
}

export interface OpswayTopBarProps {
  /** Currently active Opsway product. */
  currentApp: OpswayAppId;
  /** Optional override for the current product's home href (defaults to "/"). */
  brandHref?: string;
  /** Optional override for the Guide link (defaults to the current product's guideUrl). */
  guideHref?: string;
  /** Optional client-side navigation handler for internal guide/account clicks. */
  onNavigate?: (path: string) => void;
  /** User display name shown in the account trigger. */
  userName?: string;
  /** Secondary subtitle shown next to or under the user name (team name or email). */
  userSubtitle?: string;
  /** Optional user avatar URL. */
  avatarUrl?: string;
  /** Whether the user is authenticated (controls Sign out vs Sign in). */
  isAuthenticated?: boolean;
  /** Optional list of teams for the workspace switcher inside the account menu. */
  teams?: OpswayTeamOption[];
  currentTeamId?: number | string | null;
  onSelectTeam?: (teamId: number | string) => void;
  onCreateTeam?: () => void;
  /** Account settings href (used when onAccountSettings is not provided). */
  accountSettingsHref?: string;
  onAccountSettings?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  /** Mobile sidebar drawer trigger. When provided, a hamburger button is shown on mobile viewports. */
  onOpenMobileMenu?: () => void;
  /** Optional allowlist of suite app IDs to display in the app switcher. */
  enabledApps?: OpswayAppId[];
}

function getInitials(name?: string): string {
  if (!name) return "OP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const COLORS = {
  bg: "#191c22",
  popupBg: "#1d2128",
  hoverBg: "#252a32",
  activeBg: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#e7e9ee",
  textSecondary: "#a3aab7",
  textTertiary: "#7c8494",
};

/**
 * Shared 48px Opsway Global Suite TopBar.
 * Renders identically across Vite/MUI Joy (dashboard) and Next.js/MUI Material (log-search)
 * without coupling to either UI library.
 */
export function OpswayTopBar({
  currentApp,
  brandHref = "/",
  guideHref,
  onNavigate,
  userName,
  userSubtitle,
  avatarUrl,
  isAuthenticated = true,
  teams,
  currentTeamId,
  onSelectTeam,
  onCreateTeam,
  accountSettingsHref = "https://my.opsway.eu/account",
  onAccountSettings,
  onLogin,
  onLogout,
  onOpenMobileMenu,
  enabledApps,
}: OpswayTopBarProps) {
  const [appsOpen, setAppsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const appsRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const activeMeta = getAppMeta(currentApp);
  const resolvedGuideHref = guideHref || activeMeta.guideUrl;
  const displayName = userName || "Opsway User";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 899px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!appsOpen && !accountOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (appsOpen && appsRef.current && !appsRef.current.contains(target)) {
        setAppsOpen(false);
      }
      if (
        accountOpen &&
        accountRef.current &&
        !accountRef.current.contains(target)
      ) {
        setAccountOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAppsOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appsOpen, accountOpen]);

  const handleLinkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (onNavigate && href.startsWith("/")) {
      event.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <header
      style={{
        height: 48,
        flexShrink: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        backgroundColor: COLORS.bg,
        borderBottom: `1px solid ${COLORS.border}`,
        color: COLORS.textPrimary,
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxSizing: "border-box",
        position: "relative",
        zIndex: 1100,
        userSelect: "none",
      }}
    >
      {/* Left: Mobile menu + 9-dot App Switcher + Opsway / Product breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 0,
        }}
      >
        {isMobile && onOpenMobileMenu && (
          <button
            type="button"
            aria-label="Open navigation"
            onClick={onOpenMobileMenu}
            onMouseEnter={() => setHoveredId("mobile-menu")}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              width: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background:
                hoveredId === "mobile-menu" ? COLORS.hoverBg : "transparent",
              color:
                hoveredId === "mobile-menu"
                  ? COLORS.textPrimary
                  : COLORS.textSecondary,
              cursor: "pointer",
              padding: 0,
            }}
          >
            <MenuHamburgerIcon size={18} />
          </button>
        )}

        {/* 9-dot App Switcher */}
        <div ref={appsRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Opsway Product Suite"
            aria-expanded={appsOpen}
            aria-haspopup="menu"
            title="Opsway Product Suite"
            onClick={() => {
              setAppsOpen((v) => !v);
              setAccountOpen(false);
            }}
            onMouseEnter={() => setHoveredId("app-switcher")}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              width: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: "none",
              background:
                appsOpen || hoveredId === "app-switcher"
                  ? COLORS.hoverBg
                  : "transparent",
              color:
                appsOpen || hoveredId === "app-switcher"
                  ? COLORS.textPrimary
                  : COLORS.textSecondary,
              cursor: "pointer",
              padding: 0,
              transition: "background-color 120ms, color 120ms",
            }}
          >
            <AppsGridIcon size={18} />
          </button>

          {appsOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0,
                width: 300,
                padding: 10,
                backgroundColor: COLORS.popupBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                boxShadow: "0 12px 32px -6px rgba(0, 0, 0, 0.55)",
                zIndex: 1300,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: COLORS.textTertiary,
                  padding: "4px 8px 8px",
                }}
              >
                Opsway Product Suite
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {(enabledApps
                  ? SUITE_APPS.filter((app) => enabledApps.includes(app.id))
                  : SUITE_APPS
                ).map((app) => {
                  const isCurrent = app.id === currentApp;
                  const isHovered = hoveredId === `app-${app.id}`;
                  return (
                    <a
                      key={app.id}
                      role="menuitem"
                      href={app.url}
                      onClick={() => setAppsOpen(false)}
                      onMouseEnter={() => setHoveredId(`app-${app.id}`)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 8px",
                        borderRadius: 8,
                        textDecoration: "none",
                        backgroundColor: isCurrent
                          ? COLORS.activeBg
                          : isHovered
                            ? COLORS.hoverBg
                            : "transparent",
                        transition: "background-color 100ms",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          backgroundColor: "#232730",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <SuiteAppIcon appId={app.id} color={app.accentColor} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: COLORS.textPrimary,
                            lineHeight: 1.25,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <span>{app.name}</span>
                          {isCurrent && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: app.accentColor,
                                backgroundColor: "rgba(255,255,255,0.06)",
                                padding: "1px 6px",
                                borderRadius: 999,
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: COLORS.textTertiary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginTop: 2,
                          }}
                        >
                          {app.desc}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Opsway / Current Product breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
            paddingLeft: 2,
          }}
        >
          <a
            href="https://my.opsway.eu"
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: COLORS.textPrimary,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            opsway
          </a>
          <span
            style={{
              color: COLORS.textTertiary,
              fontSize: 14,
              opacity: 0.6,
            }}
          >
            /
          </span>
          <a
            href={brandHref}
            onClick={(e) => handleLinkClick(e, brandHref)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              fontSize: 13.5,
              fontWeight: 600,
              color: COLORS.textPrimary,
              textDecoration: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: activeMeta.accentColor,
                flexShrink: 0,
              }}
            />
            <span>{activeMeta.name}</span>
          </a>
        </div>
      </div>

      {/* Right: Guide button + Account / Team menu */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
        }}
      >
        <a
          href={resolvedGuideHref}
          onClick={(e) => handleLinkClick(e, resolvedGuideHref)}
          onMouseEnter={() => setHoveredId("guide")}
          onMouseLeave={() => setHoveredId(null)}
          title={`${activeMeta.name} Guide`}
          style={{
            height: 30,
            padding: isMobile ? "0 8px" : "0 10px",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 12.5,
            fontWeight: 500,
            color:
              hoveredId === "guide" ? COLORS.textPrimary : COLORS.textSecondary,
            backgroundColor:
              hoveredId === "guide" ? COLORS.hoverBg : "transparent",
            transition: "background-color 120ms, color 120ms",
          }}
        >
          <BookGuideIcon size={15} />
          {!isMobile && <span>Guide</span>}
        </a>

        {/* Account & Workspace menu */}
        <div ref={accountRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Account & Workspace"
            aria-expanded={accountOpen}
            aria-haspopup="menu"
            onClick={() => {
              setAccountOpen((v) => !v);
              setAppsOpen(false);
            }}
            onMouseEnter={() => setHoveredId("account")}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              height: 32,
              padding: "0 8px 0 4px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 8,
              border: "none",
              background:
                accountOpen || hoveredId === "account"
                  ? COLORS.hoverBg
                  : "transparent",
              color: COLORS.textPrimary,
              cursor: "pointer",
              transition: "background-color 120ms",
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: COLORS.textPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {getInitials(displayName)}
              </div>
            )}

            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  maxWidth: 180,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: COLORS.textPrimary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {userSubtitle || displayName}
                </span>
                <ChevronDownIcon size={14} color={COLORS.textTertiary} />
              </div>
            )}
          </button>

          {accountOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                right: 0,
                minWidth: 232,
                padding: 6,
                backgroundColor: COLORS.popupBg,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                boxShadow: "0 12px 32px -6px rgba(0, 0, 0, 0.55)",
                zIndex: 1300,
              }}
            >
              {/* Signed-in identity header */}
              <div
                style={{
                  padding: "6px 10px 8px",
                  borderBottom: `1px solid ${COLORS.border}`,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: COLORS.textPrimary,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {displayName}
                </div>
                {userSubtitle && (
                  <div
                    style={{
                      fontSize: 11.5,
                      color: COLORS.textTertiary,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: 1,
                    }}
                  >
                    {userSubtitle}
                  </div>
                )}
              </div>

              {/* Optional Team switcher */}
              {teams && teams.length > 0 && onSelectTeam && (
                <div
                  style={{
                    borderBottom: `1px solid ${COLORS.border}`,
                    paddingBottom: 4,
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 10.5,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: COLORS.textTertiary,
                      padding: "4px 10px",
                    }}
                  >
                    Switch team
                  </div>
                  {teams.map((team) => {
                    const selected = team.id === currentTeamId;
                    const itemKey = `team-${team.id}`;
                    return (
                      <button
                        key={team.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setAccountOpen(false);
                          onSelectTeam(team.id);
                        }}
                        onMouseEnter={() => setHoveredId(itemKey)}
                        onMouseLeave={() => setHoveredId(null)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          padding: "7px 10px",
                          borderRadius: 6,
                          border: "none",
                          background:
                            hoveredId === itemKey
                              ? COLORS.hoverBg
                              : selected
                                ? "rgba(255,255,255,0.04)"
                                : "transparent",
                          color: COLORS.textPrimary,
                          fontSize: 13,
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {team.name}
                        </span>
                        {selected && (
                          <CheckIcon size={14} color={activeMeta.accentColor} />
                        )}
                      </button>
                    );
                  })}
                  {onCreateTeam && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountOpen(false);
                        onCreateTeam();
                      }}
                      onMouseEnter={() => setHoveredId("create-team")}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "7px 10px",
                        borderRadius: 6,
                        border: "none",
                        background:
                          hoveredId === "create-team"
                            ? COLORS.hoverBg
                            : "transparent",
                        color: COLORS.textSecondary,
                        fontSize: 13,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <PlusIcon size={14} />
                      <span>Create new team</span>
                    </button>
                  )}
                </div>
              )}

              {/* Account settings */}
              {onAccountSettings ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    onAccountSettings();
                  }}
                  onMouseEnter={() => setHoveredId("acct-settings")}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: "none",
                    background:
                      hoveredId === "acct-settings"
                        ? COLORS.hoverBg
                        : "transparent",
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <SettingsIcon size={15} color={COLORS.textSecondary} />
                  <span>Account settings</span>
                </button>
              ) : (
                <a
                  role="menuitem"
                  href={accountSettingsHref}
                  onClick={(e) => {
                    setAccountOpen(false);
                    handleLinkClick(e, accountSettingsHref);
                  }}
                  onMouseEnter={() => setHoveredId("acct-settings")}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 6,
                    textDecoration: "none",
                    background:
                      hoveredId === "acct-settings"
                        ? COLORS.hoverBg
                        : "transparent",
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                >
                  <SettingsIcon size={15} color={COLORS.textSecondary} />
                  <span>Account settings</span>
                </a>
              )}

              {/* Sign in / Sign out */}
              {isAuthenticated && onLogout ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    onLogout();
                  }}
                  onMouseEnter={() => setHoveredId("sign-out")}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: "none",
                    background:
                      hoveredId === "sign-out" ? COLORS.hoverBg : "transparent",
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <LogOutIcon size={15} color={COLORS.textSecondary} />
                  <span>Sign out</span>
                </button>
              ) : !isAuthenticated && onLogin ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setAccountOpen(false);
                    onLogin();
                  }}
                  onMouseEnter={() => setHoveredId("sign-in")}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 6,
                    border: "none",
                    background:
                      hoveredId === "sign-in" ? COLORS.hoverBg : "transparent",
                    color: COLORS.textPrimary,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <LogInIcon size={15} color={COLORS.textSecondary} />
                  <span>Sign in</span>
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
