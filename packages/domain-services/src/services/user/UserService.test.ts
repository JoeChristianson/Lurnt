import { describe, it, expect, vi, beforeEach } from "vitest";
import { getProfile } from "./methods/getProfile";
import { updateProfile } from "./methods/updateProfile";
import { planter } from "./methods/planter";
import type { UnauthedContext, AuthedContext, TxClient } from "@lurnt/domain";

vi.mock("@lurnt/data-access", () => ({
  findUserProfileByHandle: vi.fn(),
  findUserProfileById: vi.fn(),
  updateUserProfile: vi.fn(),
  upsertUser: vi.fn(),
}));

vi.mock("@lurnt/utils", () => ({
  hashPassword: vi.fn().mockResolvedValue("hashed-pw"),
}));

vi.mock("@paralleldrive/cuid2", () => ({
  createId: vi.fn().mockReturnValue("generated-id"),
}));

import {
  findUserProfileByHandle,
  findUserProfileById,
  updateUserProfile,
  upsertUser,
} from "@lurnt/data-access";

const mockFindByHandle = vi.mocked(findUserProfileByHandle);
const mockFindById = vi.mocked(findUserProfileById);
const mockUpdate = vi.mocked(updateUserProfile);
const mockUpsert = vi.mocked(upsertUser);

function makeTxClient(): TxClient {
  return {
    _type: "tx",
    client: {
      transaction: vi.fn((fn: any) => fn({ /* nested tx mock */ })),
      execute: vi.fn(),
      select: vi.fn().mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              offset: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        values: vi.fn().mockResolvedValue(undefined),
      }),
    },
  };
}

function makeUnauthedCtx(): UnauthedContext {
  return { _type: "unauthed", db: makeTxClient() };
}

function makeAuthedCtx(): AuthedContext {
  return {
    _type: "authed",
    db: makeTxClient(),
    user: {
      userId: "user-1",
      email: "test@test.com",
      handle: "tester",
    },
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getProfile", () => {
  it("returns profile for valid handle", async () => {
    mockFindByHandle.mockResolvedValue({
      id: "user-1",
      handle: "writer",
      bio: "Hello",
      websiteUrl: null,
      socialLinks: null,
      createdAt: new Date(),
    });

    const ctx = makeUnauthedCtx();
    const result = await getProfile(ctx, { handle: "writer" });

    expect(result.handle).toBe("writer");
    expect(result.bio).toBe("Hello");
    expect(mockFindByHandle).toHaveBeenCalledWith(
      ctx,
      "writer",
    );
  });

  it("throws for unknown handle", async () => {
    mockFindByHandle.mockResolvedValue(null);

    const ctx = makeUnauthedCtx();
    await expect(
      getProfile(ctx, { handle: "nobody" }),
    ).rejects.toThrow("User not found");
  });
});

describe("updateProfile", () => {
  it("updates bio and social links", async () => {
    mockFindById.mockResolvedValue({
      bio: null,
      websiteUrl: null,
      socialLinks: null,
    });
    mockUpdate.mockResolvedValue(undefined as any);

    const ctx = makeAuthedCtx();
    const result = await updateProfile(ctx, {
      bio: "New bio",
      socialLinks: { twitter: "https://x.com/writer" },
    });

    expect(result.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      "user-1",
      expect.objectContaining({ bio: "New bio" }),
    );
  });

  it("preserves existing fields when not provided", async () => {
    mockFindById.mockResolvedValue({
      bio: "Existing bio",
      websiteUrl: "https://example.com",
      socialLinks: { twitter: "https://x.com/writer" },
    });
    mockUpdate.mockResolvedValue(undefined as any);

    const ctx = makeAuthedCtx();
    await updateProfile(ctx, { bio: "Updated bio" });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      "user-1",
      {
        bio: "Updated bio",
        websiteUrl: "https://example.com",
        socialLinks: { twitter: "https://x.com/writer" },
      },
    );
  });

  it("throws when bio exceeds 500 chars", async () => {
    mockFindById.mockResolvedValue({
      bio: null,
      websiteUrl: null,
      socialLinks: null,
    });

    const ctx = makeAuthedCtx();
    const longBio = "x".repeat(501);

    await expect(
      updateProfile(ctx, { bio: longBio }),
    ).rejects.toThrow(/exceeds maximum length/);
  });

  it("throws when user not found", async () => {
    mockFindById.mockResolvedValue(null);

    const ctx = makeAuthedCtx();
    await expect(
      updateProfile(ctx, { bio: "Hello" }),
    ).rejects.toThrow("User not found");
  });
});

describe("planter", () => {
  it("calls upsertUser with hashed password", async () => {
    mockUpsert.mockResolvedValue({
      id: "generated-id",
      created: true,
    });

    const ctx = makeUnauthedCtx();
    const result = await planter(ctx, {
      email: "bot@lurnt.app",
      handle: "erz-bot",
      password: "plaintext",
    });

    expect(result.created).toBe(true);
    expect(result.id).toBe("generated-id");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.anything(),
      {
        id: "generated-id",
        email: "bot@lurnt.app",
        handle: "erz-bot",
        passwordHash: "hashed-pw",
      },
    );
  });

  it("returns created=false when user exists", async () => {
    mockUpsert.mockResolvedValue({
      id: "existing-id",
      created: false,
    });

    const ctx = makeUnauthedCtx();
    const result = await planter(ctx, {
      email: "bot@lurnt.app",
      handle: "erz-bot",
      password: "plaintext",
    });

    expect(result.created).toBe(false);
    expect(result.id).toBe("existing-id");
  });
});
