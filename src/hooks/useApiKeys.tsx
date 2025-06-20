import { useAlert } from "@/contexts/alert";
import type { ApiKeysStore } from "@/types/ApiKeys";
import { useState, useEffect, useCallback } from "react";

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

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeysStore>({});
  const { showAlert } = useAlert();

  useEffect(() => {
    const loadApiKeys = () => {
      try {
        const stored = localStorage.getItem("apiKeys");
        if (stored) {
          const parsedKeys: ApiKeysStore = JSON.parse(stored);
          setApiKeys(parsedKeys);
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
      }
    };

    loadApiKeys();
  }, []);

  const saveToStorage = (keys: ApiKeysStore) => {
    localStorage.setItem("apiKeys", JSON.stringify(keys));
    setApiKeys(keys);
  };

  const getApiKey = useCallback(
    (serviceName: string): string | null => {
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
        console.error("Error getting API key:", error);
        return null;
      }
    },
    [apiKeys]
  );

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
      console.error("Error setting API key:", error);
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
      console.error("Error removing API key:", error);
    }
  };

  const hasApiKey = (serviceName: string): boolean => {
    return !!apiKeys[serviceName];
  };

  return {
    getApiKey,
    setApiKey,
    removeApiKey,
    hasApiKey,
    apiKeys: Object.keys(apiKeys),
  };
};
