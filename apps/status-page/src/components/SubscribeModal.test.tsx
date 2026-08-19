import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SubscribeModal from "./SubscribeModal";
import * as api from "../api";

vi.mock("../api", () => ({
  subscribeToStatusPage: vi.fn(),
}));

describe("SubscribeModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<SubscribeModal open={true} onClose={mockOnClose} domain="test.com" />);
    expect(screen.getByText("Subscribe to Updates")).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it("calls subscribe API and shows success message on valid submission", async () => {
    vi.mocked(api.subscribeToStatusPage).mockResolvedValue(undefined);

    render(<SubscribeModal open={true} onClose={mockOnClose} domain="test.com" />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const subscribeButton = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(api.subscribeToStatusPage).toHaveBeenCalledWith("test.com", "test@example.com");
      expect(screen.getByText(/Subscription request sent!/i)).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    vi.mocked(api.subscribeToStatusPage).mockRejectedValue(new Error("Network Error"));

    render(<SubscribeModal open={true} onClose={mockOnClose} domain="test.com" />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    const subscribeButton = screen.getByRole("button", { name: /Subscribe/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(subscribeButton);

    await waitFor(() => {
      expect(screen.getByText("Network Error")).toBeInTheDocument();
    });
  });
});
