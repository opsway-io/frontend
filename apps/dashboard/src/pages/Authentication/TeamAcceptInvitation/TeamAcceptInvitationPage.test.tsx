import { CssVarsProvider } from "@mui/joy";
import { JoyTheme } from "@opsway/ui";
import { fireEvent, render, screen } from "@testing-library/react";
import { jwtDecode } from "jwt-decode";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAuthenticationStore from "../../../hooks/authentication.store";
import { useAcceptTeamInvite, useCurrentTeam } from "../../../hooks/team.query";
import { useCurrentUser } from "../../../hooks/user.query";
import TeamAcceptInvitationPage from "./TeamAcceptInvitationPage";

vi.mock("react-confetti", () => ({
  default: () => <div data-testid="confetti" />,
}));

vi.mock("react-use", () => ({
  useWindowSize: () => ({ width: 1024, height: 768 }),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

vi.mock("../../../hooks/user.query", () => ({
  useCurrentUser: vi.fn(),
}));

vi.mock("../../../hooks/team.query", () => ({
  useAcceptTeamInvite: vi.fn(),
  useCurrentTeam: vi.fn(),
}));

vi.mock("../../../hooks/authentication.store", () => ({
  default: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const renderWithRouter = (
  initialEntries = ["/login/team/invite?token=valid-jwt-token"],
) => {
  return render(
    <CssVarsProvider theme={JoyTheme} defaultMode="dark">
      <MemoryRouter initialEntries={initialEntries}>
        <TeamAcceptInvitationPage />
      </MemoryRouter>
    </CssVarsProvider>,
  );
};

describe("TeamAcceptInvitationPage", () => {
  const mockMutate = vi.fn();
  const mockSetCurrentTeamID = vi.fn();
  const mockLogOut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthenticationStore).mockImplementation((selector: any) =>
      selector({
        setCurrentTeamID: mockSetCurrentTeamID,
        logOut: mockLogOut,
      }),
    );

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 1, email: "user@example.com" },
      isPending: false,
    } as any);

    vi.mocked(useAcceptTeamInvite).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    } as any);

    vi.mocked(useCurrentTeam).mockReturnValue({
      data: { id: 1, name: "Opsway Team", avatarUrl: "" },
      isPending: false,
    } as any);
  });

  it("shows invalid invitation when no token is present", () => {
    renderWithRouter(["/login/team/invite"]);

    expect(screen.getByText("Invalid invitation")).toBeInTheDocument();
    expect(
      screen.getByText("This invitation link is not valid or has expired."),
    ).toBeInTheDocument();
  });

  it("shows account mismatch when signed in as different email", () => {
    vi.mocked(jwtDecode).mockReturnValue({
      sub: "invited@example.com",
      team_id: 1,
      role: "MEMBER",
    } as any);

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 2, email: "other@example.com" },
      isPending: false,
    } as any);

    renderWithRouter(["/login/team/invite?token=invite-token"]);

    expect(screen.getByText("Account mismatch")).toBeInTheDocument();
    expect(screen.getByText("invited@example.com")).toBeInTheDocument();
    expect(screen.getByText("other@example.com")).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();

    // Clicking switch account logs out and redirects to login with returnTo
    const switchBtn = screen.getByRole("button", { name: "Switch account" });
    fireEvent.click(switchBtn);

    expect(mockLogOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining("/login?returnTo="),
      { replace: true },
    );
  });

  it("automatically calls acceptTeamInvite when email matches", () => {
    vi.mocked(jwtDecode).mockReturnValue({
      sub: "matching@example.com",
      team_id: 1,
      role: "ADMIN",
    } as any);

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 3, email: "matching@example.com" },
      isPending: false,
    } as any);

    renderWithRouter(["/login/team/invite?token=invite-token"]);

    expect(mockMutate).toHaveBeenCalledWith("invite-token", expect.any(Object));
  });

  it("renders error state when invitation acceptance fails", () => {
    vi.mocked(jwtDecode).mockReturnValue({
      sub: "matching@example.com",
      team_id: 1,
      role: "ADMIN",
    } as any);

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 3, email: "matching@example.com" },
      isPending: false,
    } as any);

    vi.mocked(useAcceptTeamInvite).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: {
        response: {
          data: {
            message: "this invitation was sent to a different email address",
          },
        },
      },
    } as any);

    renderWithRouter(["/login/team/invite?token=invite-token"]);

    expect(screen.getByText("Unable to join team")).toBeInTheDocument();
    expect(
      screen.getByText("this invitation was sent to a different email address"),
    ).toBeInTheDocument();
  });

  it("renders success state and confetti on successful acceptance", () => {
    vi.mocked(jwtDecode).mockReturnValue({
      sub: "matching@example.com",
      team_id: 1,
      role: "ADMIN",
    } as any);

    vi.mocked(useCurrentUser).mockReturnValue({
      data: { id: 3, email: "matching@example.com" },
      isPending: false,
    } as any);

    vi.mocked(useAcceptTeamInvite).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: true,
      isError: false,
      error: null,
    } as any);

    renderWithRouter(["/login/team/invite?token=invite-token"]);

    expect(screen.getByText("Welcome to the team!")).toBeInTheDocument();
    expect(screen.getByText("Opsway Team")).toBeInTheDocument();
    expect(screen.getByTestId("confetti")).toBeInTheDocument();
  });
});
