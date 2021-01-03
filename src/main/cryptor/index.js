import crypto from "crypto";

class Cryptor {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  decrypt(str) {
    return str;
  }

  encrypt(str) {
    return str;
  }
}

class Base64Cryptor extends Cryptor {
  decrypt(str) {
    return Buffer.from(str, "base64").toString("utf-8");
  }

  encrypt(str) {
    return Buffer.from(str).toString("base64");
  }
}

class Aes128GcmCryptor extends Cryptor {
  constructor(secretKey) {
    super(secretKey);
    this.iv = "12345789abcdefg";
  }

  encrypt(str) {
    let cipher = crypto.createCipheriv("aes-128-gcm", this.secretKey, this.iv);
    let data = cipher.update(str, "utf8", "hex");
    data += cipher.final("hex");
    return data;
  }

  decrypt(str) {
    let decipher = crypto.createDecipheriv(
      "aes-128-gcm",
      this.secretKey,
      this.iv
    );
    let data = decipher.update(str, "hex", "utf8");
    data += decipher.final("utf8");
    return data;
  }
}

export default {
  NoCryptor: Cryptor,
  Base64Cryptor: Base64Cryptor,
  Aes128GcmCryptor: Aes128GcmCryptor
};
