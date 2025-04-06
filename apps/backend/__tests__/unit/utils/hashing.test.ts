import argon2 from "argon2";
import { hashing, verifyHash } from "../../../src/utils/hashing.ts";

const PLAIN_PASSWORD = "PLAIN_PASSWORD";
const WRONG_PLAIN_PASSWORD = "WRONG_PLAIN_PASSWORD";
const HASHED_PASSWORD = "HASHED_PASSWORD";

describe("HASHING UTILS", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should hash a password correctly", async () => {
    jest.spyOn(argon2, "hash").mockResolvedValue(HASHED_PASSWORD);

    const hashedPassword = await hashing(PLAIN_PASSWORD);

    expect(hashedPassword).toBe(HASHED_PASSWORD);
  });

  it("should throw an error when no input is provided for hashing", async () => {
    await expect(hashing(undefined as unknown as string)).rejects.toThrow(
      "INPUT IS REQUIRED!"
    );
  });

  it("should verify a correct password", async () => {
    jest.spyOn(argon2, "verify").mockResolvedValue(true);

    const verifyHashed = await verifyHash(PLAIN_PASSWORD, HASHED_PASSWORD);

    expect(verifyHashed).toBe(true);
  });

  it("should throw an error when no input is provided for verification", async () => {
    await expect(
      verifyHash(undefined as unknown as string, undefined as unknown as string)
    ).rejects.toThrow("PLAIN_TEXT and HASHED is Required!");
  });

  it("should throw an error when password does not match", async () => {
    jest.spyOn(argon2, "verify").mockImplementation(() => {
      throw new Error("PASSWORD NOT MATCH"); // ✅ Fixed typo
    });

    await expect(
      verifyHash(WRONG_PLAIN_PASSWORD, HASHED_PASSWORD)
    ).rejects.toThrow("Hash verification failed!");
  });
});
