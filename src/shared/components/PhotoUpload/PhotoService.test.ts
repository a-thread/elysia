import { describe, it, expect, vi, beforeEach } from "vitest";

const upload = vi.fn();
const getPublicUrl = vi.fn();
const remove = vi.fn();
const storage = {
  from: vi.fn(() => ({ upload, getPublicUrl, remove })),
};

vi.mock("@shared/services/SupabaseWithAbort", () => ({
  supabaseWithAbort: {
    request: vi.fn(async (_key: string, fn: (client: unknown) => unknown) =>
      fn({ storage }),
    ),
  },
}));

const { default: PhotoService } = await import("./PhotoService");

describe("PhotoService", () => {
  beforeEach(() => {
    upload.mockReset();
    getPublicUrl.mockReset();
    remove.mockReset();
  });

  it("uploads a file and returns its public URL", async () => {
    upload.mockResolvedValue({ error: null });
    getPublicUrl.mockReturnValue({
      data: { publicUrl: "https://cdn.example/photo.jpg" },
    });

    const url = await PhotoService.addPhoto(new File(["data"], "My Photo.jpg"));

    expect(url).toBe("https://cdn.example/photo.jpg");
    expect(upload).toHaveBeenCalled();
  });

  it("throws when the upload fails", async () => {
    upload.mockResolvedValue({ error: { message: "quota exceeded" } });

    await expect(
      PhotoService.addPhoto(new File(["data"], "photo.jpg")),
    ).rejects.toThrow("Error uploading file: quota exceeded");
  });

  it("removes a photo by the filename in its URL", async () => {
    remove.mockResolvedValue({ error: null });

    await PhotoService.deletePhoto("https://cdn.example/storage/photo.jpg");

    expect(remove).toHaveBeenCalledWith(["photo.jpg"]);
  });

  it("throws when getPublicUrl returns no data (edge case)", async () => {
    getPublicUrl.mockReturnValue({ data: null });

    await expect(PhotoService.getPhotoUrl("photo.jpg")).rejects.toThrow(
      "Failed to get public URL",
    );
  });
});
