import { useAlert } from "@/contexts/alert";
import { useState, useEffect } from "react";

interface ApiKeyData {
  key: string;
  createdAt: string;
  updatedAt?: string;
  lastUsed?: string | null;
}

interface ApiKeysStore {
  [serviceName: string]: ApiKeyData;
}

interface UseApiKeysReturn {
  getApiKey: (serviceName: string) => string | null;
  setApiKey: (serviceName: string, key: string) => void;
  removeApiKey: (serviceName: string) => void;
  hasApiKey: (serviceName: string) => boolean;
  getServices: () => string[];
  clearAllKeys: () => void;
  apiKeys: string[];
  isLoading: boolean;
  error: string | null;
}

interface UseApiKeyReturn {
  key: string | null;
  setKey: (key: string) => void;
  removeKey: () => void;
  hasKey: boolean;
  isLoading: boolean;
  error: string | null;
}

const encryptKey = (key: string): string => {
  try {
    return btoa(key);
  } catch (error) {
    console.error("Error encrypting key:", error);
    throw new Error("Failed to encrypt API key");
  }
};

const decryptKey = (encryptedKey: string): string => {
  try {
    return atob(encryptedKey);
  } catch (error) {
    console.error("Error decrypting key:", error);
    return encryptedKey;
  }
};

const STORAGE_KEY = "apiKeys";

export const useApiKeys = (): UseApiKeysReturn => {
  const [apiKeys, setApiKeys] = useState<ApiKeysStore>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadApiKeys = (): void => {
      try {
        setIsLoading(true);
        setError(null);

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedKeys: ApiKeysStore = JSON.parse(stored);
          setApiKeys(parsedKeys);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error loading API keys:", error);
        setError(`Failed to load API keys: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiKeys();
  }, []);

  const saveToStorage = (keys: ApiKeysStore): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
      setApiKeys(keys);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving API keys:", error);
      setError(`Failed to save API keys: ${errorMessage}`);
    }
  };

  const getApiKey = (serviceName: string): string | null => {
    try {
      if (!serviceName.trim()) {
        throw new Error("Service name cannot be empty");
      }

      const keyData = apiKeys[serviceName];
      if (!keyData) {
        console.warn(`API key for ${serviceName} not found`);
        return null;
      }

      const updatedKeys: ApiKeysStore = {
        ...apiKeys,
        [serviceName]: {
          ...keyData,
          lastUsed: new Date().toISOString(),
        },
      };
      saveToStorage(updatedKeys);

      return decryptKey(keyData.key);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error getting API key:", error);
      setError(`Failed to get API key: ${errorMessage}`);
      return null;
    }
  };

  const setApiKey = (serviceName: string, key: string): void => {
    try {
      if (!serviceName.trim()) {
        throw new Error("Service name cannot be empty");
      }
      if (!key.trim()) {
        throw new Error("API key cannot be empty");
      }

      const encrypted = encryptKey(key);
      const now = new Date().toISOString();

      const updatedKeys: ApiKeysStore = {
        ...apiKeys,
        [serviceName]: {
          key: encrypted,
          createdAt: apiKeys[serviceName]?.createdAt || now,
          updatedAt: now,
          lastUsed: null,
        },
      };
      saveToStorage(updatedKeys);
      showAlert(
        "success",
        "API Key Saved",
        `${serviceName} key saved succesfully.`
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error setting API key:", error);
      setError(`Failed to set API key: ${errorMessage}`);
    }
  };

  const removeApiKey = (serviceName: string): void => {
    try {
      if (!serviceName.trim()) {
        throw new Error("Service name cannot be empty");
      }

      const updatedKeys: ApiKeysStore = { ...apiKeys };
      delete updatedKeys[serviceName];
      saveToStorage(updatedKeys);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error removing API key:", error);
      setError(`Failed to remove API key: ${errorMessage}`);
    }
  };

  const hasApiKey = (serviceName: string): boolean => {
    return !!apiKeys[serviceName];
  };

  const getServices = (): string[] => {
    return Object.keys(apiKeys);
  };

  // Limpiar todas las keys
  const clearAllKeys = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setApiKeys({});
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error clearing API keys:", error);
      setError(`Failed to clear API keys: ${errorMessage}`);
    }
  };

  return {
    getApiKey,
    setApiKey,
    removeApiKey,
    hasApiKey,
    getServices,
    clearAllKeys,
    apiKeys: Object.keys(apiKeys),
    isLoading,
    error,
  };
};

export const useApiKey = (serviceName: string): UseApiKeyReturn => {
  const { getApiKey, setApiKey, hasApiKey, removeApiKey, isLoading, error } =
    useApiKeys();

  if (!serviceName.trim()) {
    throw new Error("Service name is required for useApiKey hook");
  }

  const key = hasApiKey(serviceName) ? getApiKey(serviceName) : null;

  return {
    key,
    setKey: (key: string) => setApiKey(serviceName, key),
    removeKey: () => removeApiKey(serviceName),
    hasKey: hasApiKey(serviceName),
    isLoading,
    error,
  };
};

export type CommonServices = "YouTube" | string;
