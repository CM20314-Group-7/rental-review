import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// generate a hash of a password to store in the ADMIN_PASSWORD_HASH env variable
export const generatePasswordHash = async (password: string) =>
  bcrypt.hashSync(password);

// generate a random encryption key to use as the ADMIN_ENCRYPTION_KEY env variable
export const generateEncryptionKeyString = async () => {
  const key = await crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  );

  const keyString = Buffer.from(
    await crypto.subtle.exportKey('raw', key),
  ).toString('base64');

  return keyString;
};

// takes a key in the format generated by generateEncryptionKeyString and returns a CryptoKey object
export const parseEncryptionKeyString = async (keyString: string) =>
  crypto.subtle.importKey(
    'raw',
    Buffer.from(keyString, 'base64'),
    'AES-GCM',
    true,
    ['encrypt', 'decrypt'],
  );

// gets the encryption key from the ADMIN_ENCRYPTION_KEY env variable as a CryptoKey object
export const getEnvEncryptionKey = () =>
  parseEncryptionKeyString(process.env.ADMIN_ENCRYPTION_KEY!);

// encrypts data using the provided key and iv
export const encrypt = async (data: string, key: CryptoKey, iv: Uint8Array) =>
  Buffer.from(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      Buffer.from(data),
    ),
  ).toString('base64');

// reverses the above encryption
export const decrypt = async (data: string, key: CryptoKey, iv: Uint8Array) =>
  crypto.subtle
    .decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      Buffer.from(data, 'base64'),
    )
    .then((buffer) => new TextDecoder().decode(buffer));

// encrypt the given data using the ADMIN_ENCRYPTION_KEY env variable
// also returns the iv used for encryption
export const encryptWithEnvKey = async (data: string) => {
  const iv = crypto.getRandomValues(new Uint8Array(16));

  const encryptionKey = await getEnvEncryptionKey();

  const encryptedValue = Buffer.from(
    await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      encryptionKey,
      Buffer.from(data),
    ),
  ).toString('base64');

  return { data: encryptedValue, iv: iv.toString() };
};

export const decryptWithEnvKey = async (
  data: string,
  iv: string,
): Promise<string> => {
  const parsedIv = new Uint8Array(
    Buffer.from(iv)
      .toString()
      .split(',')
      .map((n) => parseInt(n, 10)),
  );

  const encryptionKey = await getEnvEncryptionKey();

  const decryptedValue = await crypto.subtle
    .decrypt(
      {
        name: 'AES-GCM',
        iv: parsedIv,
      },
      encryptionKey,
      Buffer.from(data, 'base64'),
    )
    .then((buffer) => new TextDecoder().decode(buffer));

  return decryptedValue;
};

export const passwordCookieName = 'admin-password';
export const passwordIvCookieName = 'admin-password-iv';

export const setAuthCookies = async (password: string) => {
  const cookieStore = cookies();

  const { data: encryptedPassword, iv } = await encryptWithEnvKey(password);

  cookieStore.set(passwordIvCookieName, iv);
  cookieStore.set(passwordCookieName, encryptedPassword);
};

export const getAuthCookies = async () => {
  const cookieStore = cookies();

  const passwordEncryptionIv = cookieStore.get(passwordIvCookieName)?.value;
  const encryptedPassword = cookieStore.get(passwordCookieName)?.value;

  if (!encryptedPassword || !passwordEncryptionIv) {
    return null;
  }

  const decryptedPassword = await decryptWithEnvKey(
    encryptedPassword,
    passwordEncryptionIv,
  );

  return decryptedPassword;
};

export const clearAuthCookies = () => {
  const cookieStore = cookies();

  cookieStore.delete(passwordIvCookieName);
  cookieStore.delete(passwordCookieName);
};

export const passwordMatchesEnvHash = (password: string) =>
  bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH!);

export const tryLogin = async (password: string) => {
  if (!passwordMatchesEnvHash(password)) {
    clearAuthCookies();
    return;
  }

  setAuthCookies(password);
};

export const isLoggedIn = async (): Promise<boolean> => {
  const decryptedPassword = await getAuthCookies();

  if (!decryptedPassword) {
    return false;
  }

  return passwordMatchesEnvHash(decryptedPassword);
};
