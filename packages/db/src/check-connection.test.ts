import { describe, expect, it, vi, beforeEach } from "vitest";

const queryRawMock = vi.fn();
const disconnectMock = vi.fn();

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    $queryRaw: queryRawMock,
    $disconnect: disconnectMock,
  })),
}));

import { checkConnection } from "./check-connection";

describe("checkConnection", () => {
  beforeEach(() => {
    queryRawMock.mockReset();
    disconnectMock.mockReset();
  });

  it("returns false and does not query when the env var is unset", async () => {
    const result = await checkConnection("DATABASE_URL", undefined);

    expect(result).toBe(false);
    expect(queryRawMock).not.toHaveBeenCalled();
  });

  it("returns true when the query succeeds", async () => {
    queryRawMock.mockResolvedValueOnce([{ "?column?": 1 }]);

    const result = await checkConnection("DATABASE_URL", "postgres://example");

    expect(result).toBe(true);
    expect(disconnectMock).toHaveBeenCalledOnce();
  });

  it("returns false when the query throws", async () => {
    queryRawMock.mockRejectedValueOnce(new Error("connection refused"));

    const result = await checkConnection("DIRECT_URL", "postgres://example");

    expect(result).toBe(false);
    expect(disconnectMock).toHaveBeenCalledOnce();
  });
});
