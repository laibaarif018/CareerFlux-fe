import CryptoJS from 'crypto-js';

/**
 * Configuration options for LocalStorageService
 */
interface StorageConfig {
  /**
   * Key prefix to prevent collisions (default: 'app_')
   */
  prefix?: string;
  /**
   * Enable AES encryption globally (recommended: true for sensitive data)
   */
  encrypt?: boolean;
  /**
   * Default expiration in milliseconds (optional)
   */
  expiration?: number;
  /**
   * Encryption key for AES (DO NOT store sensitive keys in client source)
   */
  encryptionKey?: string;
}

/**
 * Wrapper interface for stored values
 */
interface StorageItem<T = any> {
  value: T;
  timestamp: number;
  expiration?: number;
  encrypted?: boolean;
}

/**
 * LocalStorage Service Class
 * Secure, extensible, and type-safe localStorage manager
 * NOTE: Do not store highly sensitive data or tokens in localStorage!
 */
class LocalStorageService {
  private prefix: string;
  private encryptionEnabled: boolean;
  private defaultExpiration?: number;
  private encryptionKey: string;
  private eventCallbacks: { [event: string]: Function[] } = {};

  /**
   * @param config Custom configuration for service instance
   */
  constructor(config: StorageConfig = {}) {
    this.prefix = config.prefix || 'app_';
    this.encryptionEnabled = config.encrypt || false;
    this.defaultExpiration = config.expiration;
    this.encryptionKey = config.encryptionKey || '';

    // Warn if encryption is enabled but no key is provided
    if (this.encryptionEnabled && !this.encryptionKey) {
      console.warn('Encryption is enabled but no encryption key provided. Data will not be encrypted.');
      this.encryptionEnabled = false;
    }
  }

  /**
   * AES-encrypts string with the provided encryption key
   * @param data raw value to encrypt
   * @returns Encrypted string
   */
  private encrypt(data: string): string {
    if (!this.encryptionKey) {
      console.warn('No encryption key provided, returning unencrypted data');
      return data;
    }

    try {
      return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  /**
   * AES-decrypts string using the configured encryption key
   * @param data encrypted data from storage
   * @returns Decrypted plain string
   */
  private decrypt(data: string): string {
    if (!this.encryptionKey) {
      console.warn('No encryption key provided, returning unencrypted data');
      return data;
    }

    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return data;
    }
  }

  /**
   * Prepends the configured prefix to the storage key
   * @param key Raw key name
   * @returns Namespaced key for localStorage
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  /**
   * Tests whether browser localStorage is available and accessible
   * @returns True if localStorage works, otherwise false
   */
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if a storage item has expired, based on timestamp and expiration interval
   * @param item Item to test expiration status
   * @returns True if item is expired, else false
   */
  private isExpired(item: StorageItem): boolean {
    if (!item.expiration) return false;
    return Date.now() > item.timestamp + item.expiration;
  }

  /**
   * Stores a value in localStorage, with optional encryption and expiration
   * @param key Item name (un-prefixed)
   * @param value Value to store (will be serialized)
   * @param options Overrides for expiration and encryption
   * @returns True if successful, else false
   */
  setItem<T>(
    key: string,
    value: T,
    options: { expiration?: number; encrypt?: boolean } = {}
  ): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }
    
    try {
      const shouldEncrypt =
        options.encrypt !== undefined
    
          ? options.encrypt
          : this.encryptionEnabled;
      const storageItem: StorageItem<T> = {
        value,
        timestamp: Date.now(),
        expiration: options.expiration || this.defaultExpiration,
        encrypted: shouldEncrypt,
      };
      let serializedData = JSON.stringify(storageItem);
      if (shouldEncrypt) {
        serializedData = this.encrypt(serializedData);
      }
      localStorage.setItem(this.getKey(key), serializedData);
      this.emit('set', { key, value: storageItem.value });
      return true;
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
      return false;
    }
  }

  /**
   * Async version of setItem (useful for composability)
   */
  async setItemAsync<T>(
    key: string,
    value: T,
    options: { expiration?: number; encrypt?: boolean } = {}
  ): Promise<boolean> {
    return Promise.resolve(this.setItem(key, value, options));
  }

  /**
   * Loads and parses a value from localStorage
   * @param key Un-prefixed name
   * @returns Parsed value or null if missing or expired
   */
  getItem<T>(key: string): T | null {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return null;
    }
    try {
      let data = localStorage.getItem(this.getKey(key));
      if (!data) return null;
      let storageItem: StorageItem<T>;
      try {
        storageItem = JSON.parse(data);
        if (storageItem.encrypted) {
          const decryptedData = this.decrypt(data);
          storageItem = JSON.parse(decryptedData);
        }
      } catch {
        // Fallback for legacy/deprecated struct
        try {
          const decryptedData = this.decrypt(data);
          storageItem = JSON.parse(decryptedData);
        } catch {
          return null;
        }
      }
      if (this.isExpired(storageItem)) {
        this.removeItem(key);
        return null;
      }
      return storageItem.value;
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return null;
    }
  }

  /**
   * Async wrapper for getItem
   */
  async getItemAsync<T>(key: string): Promise<T | null> {
    return Promise.resolve(this.getItem(key));
  }

  /**
   * Removes a single item from storage
   * @param key Un-prefixed key name
   * @returns True if successful, false if key does not exist or fails
   */
  removeItem(key: string): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }
    try {
      localStorage.removeItem(this.getKey(key));
      this.emit('remove', { key });
      return true;
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
      return false;
    }
  }

  /**
   * Removes all items under the managed prefix
   * @returns True if all prefixed items are cleared
   */
  clear(): boolean {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      this.emit('clear', {});
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }

  /**
   * Returns all (un-prefixed) keys managed by this service
   * @returns Array of item keys
   */
  getAllKeys(): string[] {
    if (!this.isStorageAvailable()) return [];
    const keys: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
    } catch (error) {
      console.error('Failed to get all keys:', error);
    }
    return keys;
  }

  /**
   * Check if an unexpired item exists for this key
   * @param key Un-prefixed storage key
   * @returns True if present and not expired
   */
  hasItem(key: string): boolean {
    return this.getItem(key) !== null;
  }

  /**
   * Sums up approximate bytes used by all this service's items in localStorage
   * @returns Total size in bytes
   */
  getStorageSize(): number {
    if (!this.isStorageAvailable()) {
      return 0;
    }
    let size = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key) || '';
          size += key.length + value.length;
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage size:', error);
    }
    return size;
  }

  /**
   * Removes all expired items managed by this service
   * @returns Count of items cleaned up
   */
  cleanupExpired(): number {
    if (!this.isStorageAvailable()) {
      return 0;
    }
    let cleanedCount = 0;
    const keys = this.getAllKeys();
    keys.forEach(key => {
      try {
        const fullKey = this.getKey(key);
        let data = localStorage.getItem(fullKey);
        if (data) {
          let storageItem: StorageItem;
          try {
            storageItem = JSON.parse(data);
            if (storageItem.encrypted) {
              const decrypted = this.decrypt(data);
              storageItem = JSON.parse(decrypted);
            }
          } catch {
            try {
              const decryptedData = this.decrypt(data);
              storageItem = JSON.parse(decryptedData);
            } catch {
              return;
            }
          }
          if (this.isExpired(storageItem)) {
            localStorage.removeItem(fullKey);
            cleanedCount++;
          }
        }
      } catch (error) {
        console.error(`Failed to process key ${key} during cleanup:`, error);
      }
    });
    return cleanedCount;
  }

  /**
   * Store multiple items in one batch operation
   * @param items Array of {key, value, options} for each setItem
   * @returns Boolean array: true for success, false for failure
   */
  setItems<T>(
    items: {
      key: string;
      value: T;
      options?: { expiration?: number; encrypt?: boolean };
    }[]
  ): boolean[] {
    return items.map(item => this.setItem(item.key, item.value, item.options));
  }

  /**
   * Fetch several items in a batch
   * @param keys Array of un-prefixed keys to read
   * @returns Array of values or nulls aligned to keys
   */
  getItems<T>(keys: string[]): (T | null)[] {
    return keys.map(key => this.getItem<T>(key));
  }

  /**
   * Register an event handler for major actions (set, remove, clear)
   * @param event 'set', 'remove', or 'clear'
   * @param callback Handler to execute
   */
  on(event: 'set' | 'remove' | 'clear', callback: Function) {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  /**
   * Triggers event handlers for a service event
   */
  private emit(event: 'set' | 'remove' | 'clear', data?: any) {
    (this.eventCallbacks[event] || []).forEach(cb => cb(data));
  }
}

// ==== Export pattern ====

const storageService = new LocalStorageService({
  prefix: 'careerflux_',
  encrypt: true, // For best practice, keep encryption ON for sensitive items
  expiration: 7 * 24 * 60 * 60 * 1000, // 7 days default
  encryptionKey: typeof window !== 'undefined' ? (window as any).__STORAGE_ENCRYPTION_KEY__ || process.env.STORAGE_ENCRYPTION_KEY || 'fallback_key_for_dev' : 'server_fallback',
});

export default storageService;
export { LocalStorageService };

/**
 * ========== USAGE EXAMPLES ==========
 *
 * // Basic string storage
 * storageService.setItem('user_id', '12345');
 * const userId = storageService.getItem<string>('user_id');
 *
 * // Store with expiration (e.g., 1 hour)
 * storageService.setItem('temp_data', { test: 'ok' }, { expiration: 60 * 60 * 1000 });
 *
 * // Item-level encryption ON (global encryption: true, per-item OFF)
 * storageService.setItem('public_value', 'visible', { encrypt: false });
 *
 * // Item-level encryption ON (global encryption: false, per-item ON)
 * storageService.setItem('sensitive_key', { secret: 'top' }, { encrypt: true });
 *
 * // Batch usage
 * storageService.setItems([
 *   { key: 'x', value: 1 },
 *   { key: 'y', value: { a: 2 }, options: { encrypt: true } }
 * ]);
 * const results = storageService.getItems<number | object>(['x', 'y']);
 *
 * // Async usage
 * await storageService.setItemAsync('async_key', [1, 2, 3]);
 * const asyncVal = await storageService.getItemAsync<number[]>('async_key');
 *
 * // Event notifications
 * storageService.on('set', ({ key, value }) => { console.log('Stored', key, value); });
 *
 * // Get all managed keys
 * const allMyKeys = storageService.getAllKeys();
 *
 * // Clean up expired objects
 * const removed = storageService.cleanupExpired();
 *
 * // Remove one or all
 * storageService.removeItem('public_value');
 * storageService.clear();
 *
 * // Get approx size in bytes this service uses
 * const bytes = storageService.getStorageSize();
 *
 * // ADVANCED: Making a new instance with different prefix/security
 * const pubStorage = new LocalStorageService({ prefix: 'public_', encrypt: false });
 * pubStorage.setItem('home', 'main');
 *
 * // WARNING: Never persist authentication tokens in localStorage, even encrypted!
 * // Use secure, httpOnly cookies or in-memory strategies where possible.
 */
