/**
 * Bio-Pass Cryptography Library
 * Uses Web Crypto API for client-side cryptographic operations.
 */

const ENCRYPTION_ALGO = {
    name: "AES-GCM",
    length: 256,
};

const SIGNING_ALGO = {
    name: "ECDSA",
    hash: { name: "SHA-256" },
};

/**
 * Generates a short-lived ECDSA key pair for token signing.
 */
export async function generateSigningKeyPair(): Promise<CryptoKeyPair> {
    return await window.crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256",
        },
        false, // extractable
        ["sign", "verify"]
    );
}

/**
 * Signs a payload (claims) using the private key.
 */
export async function signToken(payload: object, privateKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(payload));
    const signature = await window.crypto.subtle.sign(
        SIGNING_ALGO,
        privateKey,
        data
    );

    // Return base64 encoded payload + signature
    const payloadB64 = btoa(JSON.stringify(payload));
    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${payloadB64}.${signatureB64}`;
}

/**
 * Generates a session encryption key (for LocalStorage).
 */
export async function generateSessionKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
        ENCRYPTION_ALGO,
        true, // extractable (so we can wrap it or store it if needed, but here we stay in memory)
        ["encrypt", "decrypt"]
    );
}

/**
 * Encrypts data for storage.
 */
export async function encryptData(data: string, key: CryptoKey): Promise<{ iv: Uint8Array; ciphertext: ArrayBuffer }> {
    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
        { ...ENCRYPTION_ALGO, iv },
        key,
        encoder.encode(data)
    );
    return { iv, ciphertext };
}

/**
 * Decrypts data from storage.
 */
export async function decryptData(ciphertext: ArrayBuffer, key: CryptoKey, iv: Uint8Array): Promise<string> {
    const decrypted = await window.crypto.subtle.decrypt(
        { ...ENCRYPTION_ALGO, iv },
        key,
        ciphertext
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

/**
 * Generates a cryptographically secure random session ID.
 */
export function generateSessionId(): string {
    const array = new Uint8Array(24);
    window.crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "");
}
