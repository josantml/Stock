/**
 * Utilidad para encriptar/desencriptar datos sensibles en localStorage
 * Nota: En producción, considerar usar una librería más robusta como "tweetnacl.js"
 */

// Encriptación simple base64 (para desarrollo/protección básica)
// En producción, usar algoritmo más fuerte

export function encryptData(data: any, secret: string = 'roma-multirubro'): string {
  try {
    const jsonString = JSON.stringify(data);
    // Codificar en base64 con una clave simple
    const encrypted = btoa(encodeURIComponent(jsonString));
    return encrypted;
  } catch (error) {
    console.error('Error encrypting data');
    return '';
  }
}

export function decryptData(encrypted: string, secret: string = 'roma-multirubro'): any {
  try {
    // Descodificar de base64
    const jsonString = decodeURIComponent(atob(encrypted));
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decrypting data');
    return null;
  }
}

export function setEncryptedLocalStorage(key: string, data: any): void {
  try {
    const encrypted = encryptData(data);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Error setting encrypted localStorage for key: ${key}`);
  }
}

export function getEncryptedLocalStorage(key: string): any {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
  } catch (error) {
    console.error(`Error getting encrypted localStorage for key: ${key}`);
    return null;
  }
}

export function removeEncryptedLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key: ${key}`);
  }
}
