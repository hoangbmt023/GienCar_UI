import { vi, describe, it, expect, beforeEach } from "vitest";
import { authService } from "../services/authService";
import publicRequest from "../services/publicRequest";
import * as tokenService from "../utils/tokenService";

// Mock các module phụ thuộc
vi.mock("../services/publicRequest");
vi.mock("../utils/tokenService");

describe("authService - login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call publicRequest.post with correct data and save tokens on success", async () => {
    // Dữ liệu đầu vào giả lập
    const loginData = { username: "abc", password: "123" };
    
    // Phản hồi giả lập từ API
    const mockResponse = {
      data: {
        data: {
          accessToken: "mock_access_token",
          refreshToken: "mock_refresh_token",
        },
      },
    };

    // Thiết lập mock để trả về mockResponse khi post được gọi
    publicRequest.post.mockResolvedValue(mockResponse);

    // Gọi hàm login
    const result = await authService.login(loginData);

    // Kiểm tra API được gọi đúng route và data
    expect(publicRequest.post).toHaveBeenCalledWith("/auth/login", loginData);
    
    // Kiểm tra hàm saveTokens được gọi đúng với token trả về
    expect(tokenService.saveTokens).toHaveBeenCalledWith(
      "mock_access_token",
      "mock_refresh_token"
    );
    
    // Kiểm tra kết quả trả về của login
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error and not save tokens if API call fails", async () => {
    const loginData = { username: "abc", password: "wrong_password" };
    const mockError = new Error("Invalid credentials");

    // Thiết lập mock để ném ra lỗi (rejected promise)
    publicRequest.post.mockRejectedValue(mockError);

    // Kỳ vọng khi gọi hàm sẽ ném ra đúng lỗi đó
    await expect(authService.login(loginData)).rejects.toThrow("Invalid credentials");

    // Vẫn gọi post đúng
    expect(publicRequest.post).toHaveBeenCalledWith("/auth/login", loginData);
    
    // Đảm bảo không gọi saveTokens nếu đăng nhập thất bại
    expect(tokenService.saveTokens).not.toHaveBeenCalled();
  });

  it("should handle missing token in response without crashing (saves undefined)", async () => {
    // 3. Response thiếu token
    const loginData = { username: "abc", password: "123" };
    const mockResponse = { data: { data: {} } }; 
    publicRequest.post.mockResolvedValue(mockResponse);

    const result = await authService.login(loginData);

    // Có gọi API
    expect(publicRequest.post).toHaveBeenCalledWith("/auth/login", loginData);
    // Không crash, nhưng saveTokens sẽ được gọi với undefined cho cả 2 params
    expect(tokenService.saveTokens).toHaveBeenCalledWith(undefined, undefined);
    expect(result).toEqual(mockResponse);
  });

  it("should crash (throw TypeError) if API returns wrong format (e.g. data: null) due to destructuring", async () => {
    // 4. API trả về sai format (null object)
    const loginData = { username: "abc", password: "123" };
    const mockResponse = { data: null };
    publicRequest.post.mockResolvedValue(mockResponse);

    // Bắt lỗi TypeError do destructuring property 'accessToken' of `res.data.data` (which is null or undefined)
    await expect(authService.login(loginData)).rejects.toThrow(TypeError);
    // saveTokens không được gọi vì crash trước đó
    expect(tokenService.saveTokens).not.toHaveBeenCalled();
  });

  it("should save tokens even if tokens are null/undefined as returned by the API", async () => {
    // 5. Token null / undefined
    const loginData = { username: "abc", password: "123" };
    const mockResponse = {
      data: {
        data: {
          accessToken: null,
          refreshToken: undefined, // cố tình để undefined hoặc thiếu
        },
      },
    };
    publicRequest.post.mockResolvedValue(mockResponse);

    await authService.login(loginData);

    // Có lưu token bậy (null, undefined) vì authService không tự validate trước khi lưu
    expect(tokenService.saveTokens).toHaveBeenCalledWith(null, undefined);
  });

  it("should attempt API call even with empty input because there is no input validation in authService", async () => {
    // 6. Validate input rỗng
    const loginData = {}; // Không truyền username/password
    const mockResponse = {
      data: { data: { accessToken: "token", refreshToken: "refresh" } },
    };
    publicRequest.post.mockResolvedValue(mockResponse);

    await authService.login(loginData);

    // Vẫn gọi API vì không có logic validate
    expect(publicRequest.post).toHaveBeenCalledWith("/auth/login", {});
  });

  it("should allow being called multiple times and overwrite tokens properly", async () => {
    // 7. Gọi nhiều lần
    const loginData = { username: "user", password: "pwd" };
    
    // Lần 1
    const mockResponse1 = { data: { data: { accessToken: "acc1", refreshToken: "ref1" } } };
    publicRequest.post.mockResolvedValueOnce(mockResponse1);
    await authService.login(loginData);
    expect(tokenService.saveTokens).toHaveBeenCalledWith("acc1", "ref1");

    // Lần 2
    const mockResponse2 = { data: { data: { accessToken: "acc2", refreshToken: "ref2" } } };
    publicRequest.post.mockResolvedValueOnce(mockResponse2);
    await authService.login(loginData);
    
    // Đảm bảo token service được gọi đè
    expect(tokenService.saveTokens).toHaveBeenCalledWith("acc2", "ref2");
    // Tổng số lần saveTokens được gọi là 2
    expect(tokenService.saveTokens).toHaveBeenCalledTimes(2);
  });
});
