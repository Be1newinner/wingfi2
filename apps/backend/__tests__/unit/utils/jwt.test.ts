import jsonwebtoken from "jsonwebtoken";

import {
  createToken,
  generateAccessToken,
  generateRefreshToken,
  generateLoginTokens,
  decryptToken,
} from "../../../src/utils/jwt.ts";

jest.mock("jsonwebtoken");

const mockUser = {
  uid: "123456",
  email: "user@example.com",
  role: "user",
};

describe("JWT UTILS FUNCTIONS", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "some-test-key";
    jest.clearAllMocks();
  });

  // Test createToken()
  it("CREATE A NEW TOKEN", async () => {
    spyOn(jsonwebtoken, "sign").mockResolvedValue("mockToken");
    // jsonwebtoken.sign.mockResolvedValue("mockToken");

    const token = await createToken({ ...mockUser, expiry: "1h" });

    expect(jsonwebtoken.sign).toHaveBeenCalledWith(
      mockUser,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // console.log({ token })

    expect(token).toBe("mockToken");
  });

  it("should throw an error, since, JWT_SECRET ENV is missing", async () => {
    delete process.env.JWT_SECRET;
    await expect(createToken({ ...mockUser, expiry: "1h" })).rejects.toThrow(
      "JWT_SECRET NOT FOUND"
    );
  });

  it("should throw an error, since, payload is missing ENV is missing", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { role, ...localMockUser } = { ...mockUser };

    await expect(
      createToken({ ...(localMockUser as typeof mockUser), expiry: "1h" })
    ).rejects.toThrow(
      "uid, email, role, expiry are required for token generation!"
    );
  });

  // Test generateAccessToken()
  it("GENERATE ACCESS TOKEN", async () => {
    jsonwebtoken.sign.mockResolvedValue("mockAccessToken");

    // console.log(mockUser)
    const token = await generateAccessToken(mockUser);

    expect(jsonwebtoken.sign).toHaveBeenCalledWith(
      mockUser,
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await expect(token).toBe("mockAccessToken");
  });

  // Test generateAccessToken()
  it("GENERATE REFRESH TOKEN", async () => {
    jsonwebtoken.sign.mockResolvedValue("mockRefreshToken");

    const token = await generateRefreshToken(mockUser);

    expect(jsonwebtoken.sign).toHaveBeenCalledWith(
      mockUser,
      process.env.JWT_SECRET,
      {
        expiresIn: 604800 * 2,
      }
    );

    await expect(token).toBe("mockRefreshToken");
  });

  // Test generateLoginToken()
  it("GENERATE LOGIN TOKENS", async () => {
    jsonwebtoken.sign
      .mockResolvedValueOnce("mockAccessToken")
      .mockResolvedValueOnce("mockRefreshToken");

    const tokens = await generateLoginTokens(mockUser);

    expect(jsonwebtoken.sign).toHaveBeenNthCalledWith(
      1,
      mockUser,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    expect(jsonwebtoken.sign).toHaveBeenNthCalledWith(
      2,
      mockUser,
      process.env.JWT_SECRET,
      { expiresIn: 604800 * 2 }
    );

    expect(tokens.accessToken).toBe("mockAccessToken");
    expect(tokens.refreshToken).toBe("mockRefreshToken");

    expect(jsonwebtoken.sign).toHaveBeenCalledTimes(2);
  });

  // Test decryptToken()
  it("DECRYPTING TOKENS", async () => {
    jsonwebtoken.verify.mockReturnValue(mockUser);

    const decryptedTokens = await decryptToken("THE_TOKEN_IS_HERE");

    expect(jsonwebtoken.verify).toHaveBeenCalledWith(
      "THE_TOKEN_IS_HERE",
      process.env.JWT_SECRET
    );

    expect(decryptedTokens.email).toBe(mockUser.email);
    expect(decryptedTokens.uid).toBe(mockUser.uid);
    expect(decryptedTokens.role).toBe(mockUser.role);
  });

  // Test decryptToken() errors
  it("TO BE THROWN ERROR WHEN JWT_SECRET NOT FOUND", async () => {
    delete process.env.JWT_SECRET;

    await expect(decryptToken("THE_TOKEN_IS_HERE")).rejects.toThrow(
      "JWT_SECRET NOT FOUND OR INVALID"
    );
  });

  // Test decryptToken() errors
  it("TO BE THROWN ERROR WHEN TOKEN IS INVALID", async () => {
    jsonwebtoken.verify.mockImplementation(() => {
      throw new Error("Token expired");
    });

    await expect(decryptToken("invalid_Token")).rejects.toThrow(
      "Invalid or expired token"
    );
  });

  it("TO BE THROWN ERROR WHEN TOKEN IS NOT STRING", async () => {
    await expect(decryptToken(null)).rejects.toThrow(
      "TOKEN IS REQUIRED AND MUST BE A STRING"
    );
  });
});
