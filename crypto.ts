import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "crypto";

const algorithm = "aes-192-cbc";
const salt = "12345678";
const password = "password";
const key = scryptSync(password, salt, 24);
const iv = randomBytes(16);

const data = "plain text";
const inputEncoding = "utf8";
const outputEncoding = "hex";

const cipher = createCipheriv(algorithm, key, iv);
const encrypted = cipher.update(data, inputEncoding, outputEncoding);
export const encryptedText = encrypted + cipher.final(outputEncoding);

const decipher = createDecipheriv(algorithm, key, iv);
const decrypted = decipher.update(encryptedText, outputEncoding, inputEncoding);
export const decryptedText = decrypted + decipher.final(inputEncoding);
