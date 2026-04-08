import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jwt-decode", () => ({
  jwtDecode: (token) => {
    // simple fake decode: token contains payload after ':' for tests
    if (!token) throw new Error("invalid");
    // return a payload with exp in future and sample fields
    return {
      exp: Math.floor(Date.now() / 1000) + 3600,
      email: "a@b.com",
      role: ["ADMIN"],
    };
  },
}));

import {
  saveTokens,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  decodeToken,
  getUserFromToken,
  getRoleFromToken,
  isTokenExpired,
  isAuthenticated,
} from "../utils/tokenService";

describe("tokenService", () => {
  beforeEach(() => {
    localStorage.clear();
    // do not reset module mocks here; clear localStorage only
    vi.clearAllMocks();
  });

  it("saves and reads tokens", () => {
    saveTokens("access123", "refresh456");
    expect(getAccessToken()).toBe("access123");
    expect(getRefreshToken()).toBe("refresh456");
  });

  it("clearTokens removes tokens", () => {
    saveTokens("a", "b");
    clearTokens();
    expect(getAccessToken()).toBe(null);
    expect(getRefreshToken()).toBe(null);
  });

  it("decodeToken returns decoded payload or null", () => {
    // when no token
    expect(decodeToken()).toBeNull();

    // when token present (mocked jwtDecode will return object)
    localStorage.setItem("accessToken", "fake:token");
    const dec = decodeToken();
    expect(dec).toHaveProperty("email", "a@b.com");
  });

  it("getUserFromToken and getRoleFromToken", () => {
    localStorage.setItem("accessToken", "fake:token");
    expect(getUserFromToken()).toBe("a@b.com");
    expect(getRoleFromToken()).toBe("ADMIN");
  });

  it("isTokenExpired and isAuthenticated behavior", () => {
    // expired when no token
    expect(isTokenExpired(null)).toBe(true);
    expect(isAuthenticated()).toBe(false);

    // with token jwtDecode mocked to future exp
    localStorage.setItem("accessToken", "fake:token");
    expect(isTokenExpired("fake:token")).toBe(false);
    expect(isAuthenticated()).toBe(true);
  });
});
