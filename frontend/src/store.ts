import { create } from 'zustand';
import { Asset, Collection, Tag, ViewMode, FilterState } from './types';
import { assetsAPI, collectionsAPI, tagsAPI } from './api';

interface AppState {
  // Data
  assets: Asset[];
  collections: Collection[];
  tags: Tag[];
  
  // UI State
  viewMode: ViewMode;
  filters: FilterState;
  selectedAssets: Set<string>;
  selectedAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSelectedAssets: (assetIds: Set<string>) => void;
  toggleAssetSelection: (assetId: string) => void;
  clearSelection: () => void;
  setSelectedAsset: (asset: Asset | null) => void;
  
  // Data fetching
  fetchAssets: () => Promise<void>;
  fetchCollections: () => Promise<void>;
  fetchTags: () => Promise<void>;
  
  // Asset operations
  createAsset: (asset: Partial<Asset>) => Promise<void>;
  updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  bulkUpdateAssets: (assetIds: string[], updates: Partial<Asset>) => Promise<void>;
  bulkDeleteAssets: (assetIds: string[]) => Promise<void>;
  
  // Collection operations
  createCollection: (collection: Partial<Collection>) => Promise<void>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  
  // Tag operations
  createTag: (name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  assets: [],
  collections: [],
  tags: [],
  viewMode: 'grid',
  filters: {
    search: '',
    tags: [],
    collectionId: null,
    sortBy: 'date',
    sortOrder: 'desc',
  },
  selectedAssets: new Set(),
  selectedAsset: null,
  isLoading: false,
  error: null,
  
  // UI Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
    get().fetchAssets();
  },
  
  setSelectedAssets: (assetIds) => set({ selectedAssets: assetIds }),
  
  toggleAssetSelection: (assetId) => {
    const selected = new Set(get().selectedAssets);
    if (selected.has(assetId)) {
      selected.delete(assetId);
    } else {
      selected.add(assetId);
    }
    set({ selectedAssets: selected });
  },
  
  clearSelection: () => set({ selectedAssets: new Set() }),
  
  setSelectedAsset: (asset) => set({ selectedAsset: asset }),
  
  // Data fetching
  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const assets = await assetsAPI.getAll(get().filters);
      set({ assets, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  fetchCollections: async () => {
    try {
      const collections = await collectionsAPI.getAll();
      set({ collections });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  fetchTags: async () => {
    try {
      const tags = await tagsAPI.getAll();
      set({ tags });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  // Asset operations
  createAsset: async (asset) => {
    try {
      await assetsAPI.create(asset);
      await get().fetchAssets();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  updateAsset: async (id, updates) => {
    try {
      await assetsAPI.update(id, updates);
      await get().fetchAssets();
      // Update selected asset if it's the one being updated
      if (get().selectedAsset?.id === id) {
        const updatedAsset = await assetsAPI.getById(id);
        set({ selectedAsset: updatedAsset });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  deleteAsset: async (id) => {
    try {
      await assetsAPI.delete(id);
      await get().fetchAssets();
      if (get().selectedAsset?.id === id) {
        set({ selectedAsset: null });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  bulkUpdateAssets: async (assetIds, updates) => {
    try {
      await assetsAPI.bulkUpdate(assetIds, updates);
      await get().fetchAssets();
      get().clearSelection();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  bulkDeleteAssets: async (assetIds) => {
    try {
      await assetsAPI.bulkDelete(assetIds);
      await get().fetchAssets();
      get().clearSelection();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  // Collection operations
  createCollection: async (collection) => {
    try {
      await collectionsAPI.create(collection);
      await get().fetchCollections();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  updateCollection: async (id, updates) => {
    try {
      await collectionsAPI.update(id, updates);
      await get().fetchCollections();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  deleteCollection: async (id) => {
    try {
      await collectionsAPI.delete(id);
      await get().fetchCollections();
      await get().fetchAssets();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  // Tag operations
  createTag: async (name) => {
    try {
      await tagsAPI.create(name);
      await get().fetchTags();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
  
  deleteTag: async (id) => {
    try {
      await tagsAPI.delete(id);
      await get().fetchTags();
      await get().fetchAssets();
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },
}));
