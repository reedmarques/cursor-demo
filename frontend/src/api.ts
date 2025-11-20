import { Asset, Collection, Tag, FilterState } from './types';

const API_BASE_URL = '/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }
  return response.json();
}

// Assets API
export const assetsAPI = {
  getAll: async (filters?: Partial<FilterState>): Promise<Asset[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tags && filters.tags.length > 0) params.append('tags', filters.tags.join(','));
    if (filters?.collectionId) params.append('collectionId', filters.collectionId);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    
    const url = `${API_BASE_URL}/assets${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    return handleResponse<Asset[]>(response);
  },

  getById: async (id: string): Promise<Asset> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`);
    return handleResponse<Asset>(response);
  },

  create: async (asset: Partial<Asset>): Promise<Asset> => {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    return handleResponse<Asset>(response);
  },

  update: async (id: string, asset: Partial<Asset>): Promise<Asset> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    return handleResponse<Asset>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  bulkUpdate: async (assetIds: string[], updates: Partial<Asset>): Promise<Asset[]> => {
    const response = await fetch(`${API_BASE_URL}/assets/bulk`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetIds, updates }),
    });
    return handleResponse<Asset[]>(response);
  },

  bulkDelete: async (assetIds: string[]): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/assets/bulk-delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assetIds }),
    });
    return handleResponse<void>(response);
  },
};

// Collections API
export const collectionsAPI = {
  getAll: async (): Promise<Collection[]> => {
    const response = await fetch(`${API_BASE_URL}/collections`);
    return handleResponse<Collection[]>(response);
  },

  getById: async (id: string): Promise<Collection & { assets: Asset[] }> => {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`);
    return handleResponse<Collection & { assets: Asset[] }>(response);
  },

  create: async (collection: Partial<Collection>): Promise<Collection> => {
    const response = await fetch(`${API_BASE_URL}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    });
    return handleResponse<Collection>(response);
  },

  update: async (id: string, collection: Partial<Collection>): Promise<Collection> => {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collection),
    });
    return handleResponse<Collection>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};

// Tags API
export const tagsAPI = {
  getAll: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_BASE_URL}/tags`);
    return handleResponse<Tag[]>(response);
  },

  create: async (name: string): Promise<Tag> => {
    const response = await fetch(`${API_BASE_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return handleResponse<Tag>(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },
};
