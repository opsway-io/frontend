"use client";

import React, { useCallback, useEffect, useState } from "react";
import { OPSWAY_API_URL, resolveOpswaySession } from "../lib/opswayApi";

type TeamTab = "people" | "invitations";

interface TeamMember {
  id: number;
  name?: string;
  email: string;
  role: string;
}

interface TeamInvite {
  email: string;
  role: string;
  createdAt?: string;
}

export function TeamPanel() {
  const [activeTab, setActiveTab] = useState<TeamTab>("people");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [teamId, setTeamId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState<string>("");
  const [myRole, setMyRole] = useState<string>("MEMBER");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const [submitting, setSubmitting] = useState(false);

  const canManageInvites = myRole === "OWNER" || myRole === "ADMIN";

  const fetchTeamData = useCallback(async () => {
    const session = await resolveOpswaySession();
    if (!session.authenticated || !session.teamId) {
      return {
        error: session.error,
        teamId: null as number | null,
        teamName: "",
        myRole: "MEMBER",
        members: [] as TeamMember[],
        invites: [] as TeamInvite[],
      };
    }

    const role = (session.team?.role ?? "MEMBER").toUpperCase();
    const isAdminOrOwner = role === "OWNER" || role === "ADMIN";

    const [usersRes, invitesRes] = await Promise.all([
      fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}/users`, {
        credentials: "include",
      }),
      isAdminOrOwner
        ? fetch(`${OPSWAY_API_URL}/v1/teams/${session.teamId}/users/invites`, {
            credentials: "include",
          })
        : Promise.resolve(null),
    ]);

    const usersJson = usersRes.ok ? await usersRes.json() : {};
    const invitesJson = invitesRes && invitesRes.ok ? await invitesRes.json() : {};

    return {
      error: null as string | null,
      teamId: session.teamId,
      teamName: session.team?.displayName || session.team?.name || "",
      myRole: role,
      members: (usersJson?.users ?? []) as TeamMember[],
      invites: (invitesJson?.invites ?? []) as TeamInvite[],
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchTeamData();
      setError(res.error);
      setTeamId(res.teamId);
      setTeamName(res.teamName);
      setMyRole(res.myRole);
      setMembers(res.members);
      setInvites(res.invites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team.");
    } finally {
      setLoading(false);
    }
  }, [fetchTeamData]);

  useEffect(() => {
    let cancelled = false;
    fetchTeamData()
      .then((res) => {
        if (cancelled) return;
        setError(res.error);
        setTeamId(res.teamId);
        setTeamName(res.teamName);
        setMyRole(res.myRole);
        setMembers(res.members);
        setInvites(res.invites);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load team.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchTeamData]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !inviteEmail.trim()) return;
    setSubmitting(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/users/invites`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: inviteEmail.trim(),
            role: inviteRole,
          }),
        },
      );
      if (res.status === 402) {
        throw new Error(
          "Team member limit reached for your current plan. Upgrade in Usage & Billing.",
        );
      }
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || `Failed to invite user (${res.status})`);
      }
      setInviteEmail("");
      setNotice(`Invitation sent to ${inviteEmail.trim()}.`);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send invitation.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevokeInvite = async (email: string) => {
    if (!teamId) return;
    setSubmitting(true);
    setNotice(null);
    setError(null);
    try {
      const res = await fetch(
        `${OPSWAY_API_URL}/v1/teams/${teamId}/users/invites/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to revoke invitation (${res.status})`);
      }
      setNotice(`Invitation for ${email} revoked.`);
      await reload();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to revoke invitation.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page Header (matches dashboard TeamPage) */}
      <div>
        <h1 className="m-0 text-2xl font-semibold text-[#e7e9ee]">
          Team{teamName ? ` — ${teamName}` : ""}
        </h1>
        <p className="mt-1 mb-0 text-sm text-[#a3aab7]">
          Manage team members and pending invitations for your Opsway workspace.
        </p>
      </div>

      {/* Top Horizontal Selection Bar (matches dashboard RouteTabs) */}
      <div className="flex items-center gap-1 border-b border-white/[0.08]">
        <button
          type="button"
          onClick={() => setActiveTab("people")}
          className={`px-3.5 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent ${
            activeTab === "people"
              ? "border-[#5185a5] text-[#e7e9ee]"
              : "border-transparent text-[#a3aab7] hover:text-[#e7e9ee]"
          }`}
        >
          People ({members.length})
        </button>
        {canManageInvites && (
          <button
            type="button"
            onClick={() => setActiveTab("invitations")}
            className={`px-3.5 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent ${
              activeTab === "invitations"
                ? "border-[#5185a5] text-[#e7e9ee]"
                : "border-transparent text-[#a3aab7] hover:text-[#e7e9ee]"
            }`}
          >
            Invitations ({invites.length})
          </button>
        )}
      </div>

      {notice && (
        <div className="px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="p-6 text-sm text-[#a3aab7]">Loading team members…</div>
      ) : error && !teamId ? (
        <div className="p-6 rounded-xl bg-[#1d2128] border border-white/[0.08] flex flex-col gap-3">
          <div className="text-sm text-[#fca5a5]">{error}</div>
          <a
            href="https://my.opsway.eu/login"
            className="self-start px-3 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold no-underline"
          >
            Sign in on Opsway Hub
          </a>
        </div>
      ) : (
        <>
          {error && (
            <div className="px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {activeTab === "people" ? (
            <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#7c8494]">
                    <th className="py-3 px-4 font-medium">Member</th>
                    <th className="py-3 px-4 font-medium">Email</th>
                    <th className="py-3 px-4 font-medium text-right">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-6 px-4 text-center text-[#7c8494]"
                      >
                        No team members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-white/[0.05] text-[#e7e9ee]"
                      >
                        <td className="py-3 px-4 font-medium">
                          {m.name || m.email}
                        </td>
                        <td className="py-3 px-4 text-[#a3aab7]">{m.email}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/[0.08] text-[#cbd5e1]">
                            {m.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Invite form */}
              <form
                onSubmit={handleSendInvite}
                className="rounded-xl bg-[#1d2128] border border-white/[0.09] p-4 flex flex-wrap items-end gap-3"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                  <label
                    htmlFor="log-search-invite-email"
                    className="text-xs text-[#a3aab7]"
                  >
                    Invite by email
                  </label>
                  <input
                    id="log-search-invite-email"
                    type="email"
                    required
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="bg-[#161920] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e7e9ee] outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="log-search-invite-role"
                    className="text-xs text-[#a3aab7]"
                  >
                    Role
                  </label>
                  <select
                    id="log-search-invite-role"
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "MEMBER" | "ADMIN")
                    }
                    className="bg-[#161920] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-[#e7e9ee] outline-none"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-[#5185a5] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending…" : "Send Invite"}
                </button>
              </form>

              {/* Pending Invites Table */}
              <div className="rounded-xl bg-[#1d2128] border border-white/[0.09] overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[#7c8494]">
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Role</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invites.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="py-6 px-4 text-center text-[#7c8494]"
                        >
                          No pending invitations.
                        </td>
                      </tr>
                    ) : (
                      invites.map((inv) => (
                        <tr
                          key={inv.email}
                          className="border-b border-white/[0.05] text-[#e7e9ee]"
                        >
                          <td className="py-3 px-4">{inv.email}</td>
                          <td className="py-3 px-4 text-[#a3aab7]">
                            {inv.role}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              disabled={submitting}
                              onClick={() => handleRevokeInvite(inv.email)}
                              className="px-2.5 py-1 rounded-md border border-red-500/30 text-red-300 text-[11px] bg-transparent cursor-pointer hover:bg-red-500/10"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
