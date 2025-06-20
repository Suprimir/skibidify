export interface ApiKeyData {
  key: string;
  createdAt: string;
  updatedAt?: string;
  lastUsed?: string | null;
}

export interface ApiKeysStore {
  [serviceName: string]: ApiKeyData;
}
