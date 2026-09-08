import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";

const toast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

vi.mock("@shared/components/Toast", () => ({
  useToast: () => toast,
}));

vi.mock("@shared/services/UserService", () => ({
  UserService: { findByEmail: vi.fn() },
}));

Object.assign(navigator, { clipboard: { writeText: vi.fn() } });

const { UserService } = await import("@shared/services/UserService");
const { useShareableEntity } = await import("./useShareableEntity");

const baseArgs = () => ({
  entityId: "e1",
  entityLabel: "Recipe",
  initialIsPublic: false,
  initialPublicPermission: "read" as const,
  fetchSharedUsers: vi.fn().mockResolvedValue([]),
  setIsPublic: vi.fn().mockResolvedValue(undefined),
  share: vi.fn().mockResolvedValue(undefined),
  revokeAccess: vi.fn().mockResolvedValue(undefined),
});

describe("useShareableEntity", () => {
  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
    vi.mocked(UserService.findByEmail).mockReset();
  });

  it("seeds isPublic from initialIsPublic and fetches shared users on mount", async () => {
    const args = baseArgs();
    args.fetchSharedUsers.mockResolvedValue([
      { id: "s1", permission: "read", users: { email: "a@b.com" } },
    ]);

    const { result } = renderHook(() => useShareableEntity(args));

    expect(result.current.isPublic).toBe(false);
    await waitFor(() => expect(result.current.sharedUsers).toHaveLength(1));
    expect(args.fetchSharedUsers).toHaveBeenCalledWith("e1");
  });

  it("toggles public status and shares with a user on success", async () => {
    const args = baseArgs();
    vi.mocked(UserService.findByEmail).mockResolvedValue({
      id: "u2",
      display_name: "Bea",
      profile_image: null,
    });

    const { result } = renderHook(() => useShareableEntity(args));
    await waitFor(() => expect(args.fetchSharedUsers).toHaveBeenCalled());

    await act(() => result.current.toggleIsPublic());
    expect(result.current.isPublic).toBe(true);
    expect(args.setIsPublic).toHaveBeenCalledWith("e1", true, "read");
    expect(toast.success).toHaveBeenCalled();

    await act(() => result.current.shareWithUser("bea@example.com", "read"));
    expect(args.share).toHaveBeenCalledWith("e1", "u2", "read");
  });

  it("updates the public permission on success", async () => {
    const args = baseArgs();

    const { result } = renderHook(() => useShareableEntity(args));
    await waitFor(() => expect(args.fetchSharedUsers).toHaveBeenCalled());

    await act(() => result.current.setPublicPermission("edit"));
    expect(result.current.publicPermission).toBe("edit");
    expect(args.setIsPublic).toHaveBeenCalledWith("e1", false, "edit");
    expect(toast.success).toHaveBeenCalled();
  });

  it("surfaces an error toast when updating the public permission fails", async () => {
    const args = baseArgs();
    args.setIsPublic.mockRejectedValue(new Error("Failed to update public status."));

    const { result } = renderHook(() => useShareableEntity(args));
    await waitFor(() => expect(args.fetchSharedUsers).toHaveBeenCalled());

    await act(() => result.current.setPublicPermission("edit"));
    expect(toast.error).toHaveBeenCalledWith("Failed to update public status.");
    expect(result.current.publicPermission).toBe("read");
  });

  it("surfaces an error toast when sharing fails", async () => {
    const args = baseArgs();
    vi.mocked(UserService.findByEmail).mockRejectedValue(
      new Error("User not found."),
    );

    const { result } = renderHook(() => useShareableEntity(args));
    await waitFor(() => expect(args.fetchSharedUsers).toHaveBeenCalled());

    await act(() => result.current.shareWithUser("nobody@example.com", "read"));
    expect(toast.error).toHaveBeenCalledWith("User not found.");
    expect(args.share).not.toHaveBeenCalled();
  });

  it("does not fetch or toggle when entityId is undefined (edge case)", async () => {
    const args = { ...baseArgs(), entityId: undefined };

    const { result } = renderHook(() => useShareableEntity(args));
    await act(() => result.current.toggleIsPublic());

    expect(args.fetchSharedUsers).not.toHaveBeenCalled();
    expect(args.setIsPublic).not.toHaveBeenCalled();
  });
});
