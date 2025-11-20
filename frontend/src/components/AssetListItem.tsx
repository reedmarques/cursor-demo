import { Tag } from 'lucide-react';
import { Asset } from '../types';
import { useStore } from '../store';
import { formatFileSize, formatDate } from '../utils';

interface AssetListItemProps {
  asset: Asset;
}

export default function AssetListItem({ asset }: AssetListItemProps) {
  const { selectedAssets, toggleAssetSelection, setSelectedAsset, collections } = useStore();
  const isSelected = selectedAssets.has(asset.id);
  const collection = collections.find((c) => c.id === asset.collectionId);

  return (
    <div
      className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={() => setSelectedAsset(asset)}
    >
      {/* Checkbox */}
      <div className="col-span-1 flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            toggleAssetSelection(asset.id);
          }}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
      </div>
      
      {/* Preview */}
      <div className="col-span-1 flex items-center">
        <img
          src={asset.imageUrl}
          alt={asset.title}
          className="w-12 h-12 object-cover rounded"
          loading="lazy"
        />
      </div>
      
      {/* Name */}
      <div className="col-span-3 flex flex-col justify-center">
        <h3 className="font-medium text-gray-900 truncate">{asset.title}</h3>
        <p className="text-sm text-gray-500 truncate">{asset.fileName}</p>
      </div>
      
      {/* Tags */}
      <div className="col-span-2 flex items-center">
        <div className="flex flex-wrap gap-1">
          {asset.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
            </span>
          ))}
          {asset.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{asset.tags.length - 2}
            </span>
          )}
        </div>
      </div>
      
      {/* Collection */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-700 truncate">
          {collection?.name || 'No collection'}
        </span>
      </div>
      
      {/* Date */}
      <div className="col-span-2 flex items-center">
        <span className="text-sm text-gray-600">{formatDate(asset.uploadDate)}</span>
      </div>
      
      {/* Size */}
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-gray-600">{formatFileSize(asset.fileSize)}</span>
      </div>
    </div>
  );
}
