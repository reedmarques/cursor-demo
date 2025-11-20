import { useStore } from '../store';
import AssetCard from './AssetCard';
import AssetListItem from './AssetListItem';

export default function AssetGallery() {
  const { assets, viewMode } = useStore();

  if (assets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No assets found</h3>
          <p className="text-gray-500">Try adjusting your filters or search query</p>
        </div>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {assets.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="col-span-1">
              <input type="checkbox" className="rounded" />
            </div>
            <div className="col-span-1">Preview</div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Tags</div>
            <div className="col-span-2">Collection</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-1">Size</div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <AssetListItem key={asset.id} asset={asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
