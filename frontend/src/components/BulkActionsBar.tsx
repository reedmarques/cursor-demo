import { useState } from 'react';
import { X, Trash2, Tag, Folder } from 'lucide-react';
import { useStore } from '../store';

export default function BulkActionsBar() {
  const { selectedAssets, collections, tags, bulkUpdateAssets, bulkDeleteAssets, clearSelection } = useStore();
  const [showMoveToCollection, setShowMoveToCollection] = useState(false);
  const [showAddTags, setShowAddTags] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleMoveToCollection = async () => {
    if (selectedCollectionId) {
      await bulkUpdateAssets(Array.from(selectedAssets), {
        collectionId: selectedCollectionId || null,
      });
      setShowMoveToCollection(false);
      setSelectedCollectionId('');
    }
  };

  const handleAddTags = async () => {
    if (selectedTags.length > 0) {
      // Get current tags for each selected asset and merge with new tags
      const assetIds = Array.from(selectedAssets);
      await bulkUpdateAssets(assetIds, {
        tags: selectedTags,
      });
      setShowAddTags(false);
      setSelectedTags([]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedAssets.size} asset(s)?`)) {
      await bulkDeleteAssets(Array.from(selectedAssets));
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white shadow-2xl z-40 animate-slide-up">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">{selectedAssets.size} asset(s) selected</span>
            
            {/* Move to Collection */}
            {showMoveToCollection ? (
              <div className="flex items-center space-x-2">
                <select
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                  className="px-3 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleMoveToCollection}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Move
                </button>
                <button
                  onClick={() => {
                    setShowMoveToCollection(false);
                    setSelectedCollectionId('');
                  }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowMoveToCollection(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Folder className="w-4 h-4" />
                <span>Move to Collection</span>
              </button>
            )}
            
            {/* Add Tags */}
            {showAddTags ? (
              <div className="flex items-center space-x-2">
                <div className="flex flex-wrap gap-2 bg-white rounded-lg px-3 py-2 max-w-md">
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedTags(selectedTags.filter((t) => t !== tag.name));
                          } else {
                            setSelectedTags([...selectedTags, tag.name]);
                          }
                        }}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleAddTags}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddTags(false);
                    setSelectedTags([]);
                  }}
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddTags(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
              >
                <Tag className="w-4 h-4" />
                <span>Add Tags</span>
              </button>
            )}
            
            {/* Delete */}
            <button
              onClick={handleBulkDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
          
          {/* Clear Selection */}
          <button
            onClick={clearSelection}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
