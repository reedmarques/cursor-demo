import { Tag, Download, MoreVertical } from 'lucide-react';
import { Asset } from '../types';
import { useStore } from '../store';
import { formatFileSize, formatDate } from '../utils';

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
  const { selectedAssets, toggleAssetSelection, setSelectedAsset } = useStore();
  const isSelected = selectedAssets.has(asset.id);

  return (
    <div
      className={`group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
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
      
      {/* Quick Actions */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = asset.imageUrl;
            link.download = asset.fileName;
            link.click();
          }}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          title="Download"
        >
          <Download className="w-4 h-4 text-gray-700" />
        </button>
      </div>
      
      {/* Image */}
      <div
        onClick={() => setSelectedAsset(asset)}
        className="aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={asset.imageUrl}
          alt={asset.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">{asset.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{asset.description}</p>
        
        {/* Tags */}
        {asset.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {asset.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
              >
                <Tag className="w-3 h-3" />
                <span>{tag}</span>
              </span>
            ))}
            {asset.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                +{asset.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatFileSize(asset.fileSize)}</span>
          <span>{formatDate(asset.uploadDate)}</span>
        </div>
      </div>
    </div>
  );
}
