export interface Asset {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  imageUrl: string;
  tags: string[];
  copyright: string;
  usageRights: string;
  collectionId: string | null;
  uploadDate: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
}

export type ViewMode = 'grid' | 'list';
export type SortBy = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  search: string;
  tags: string[];
  collectionId: string | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
}
