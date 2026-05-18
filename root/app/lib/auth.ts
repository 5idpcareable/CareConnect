import crypto from "crypto";

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const ITERATIONS = 310000;
const DIGEST = "sha256";

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(":");

  if (!salt || !storedHash) {
    return false;
  }

  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString("hex");

  return crypto.timingSafeEqual(
    Buffer.from(storedHash, "hex"),
    Buffer.from(hash, "hex")
  );
}