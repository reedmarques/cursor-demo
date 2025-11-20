import { useState } from 'react';
import { Folder, Tag, Plus, ChevronRight, X, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '../store';

export default function Sidebar() {
  const { collections, tags, filters, setFilters, createCollection, updateCollection, deleteCollection } = useStore();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreateCollection = async () => {
    if (newCollectionName.trim()) {
      await createCollection({
        name: newCollectionName,
        description: '',
      });
      setNewCollectionName('');
      setIsCreatingCollection(false);
    }
  };

  const handleUpdateCollection = async (id: string) => {
    if (editingName.trim()) {
      await updateCollection(id, { name: editingName });
      setEditingCollectionId(null);
      setEditingName('');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      await deleteCollection(id);
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        {/* Collections Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Collections</h2>
            <button
              onClick={() => setIsCreatingCollection(true)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Create collection"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          {/* All Assets */}
          <button
            onClick={() => setFilters({ collectionId: null })}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
              !filters.collectionId
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Folder className="w-4 h-4" />
            <span className="text-sm font-medium">All Assets</span>
          </button>
          
          {/* Create Collection Form */}
          {isCreatingCollection && (
            <div className="mt-2 ml-6 flex items-center space-x-2">
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreateCollection()}
                placeholder="Collection name"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreateCollection}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setIsCreatingCollection(false);
                  setNewCollectionName('');
                }}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {/* Collection List */}
          <div className="mt-2 space-y-1">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  filters.collectionId === collection.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {editingCollectionId === collection.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleUpdateCollection(collection.id)}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateCollection(collection.id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingCollectionId(null);
                        setEditingName('');
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setFilters({ collectionId: collection.id })}
                      className="flex-1 flex items-center space-x-2 text-left"
                    >
                      <Folder className="w-4 h-4" />
                      <span className="text-sm font-medium truncate">{collection.name}</span>
                    </button>
                    <div className="hidden group-hover:flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingCollectionId(collection.id);
                          setEditingName(collection.name);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteCollection(collection.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tags Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">Filter by Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isSelected = filters.tags.includes(tag.name);
              return (
                <button
                  key={tag.id}
                  onClick={() => {
                    const newTags = isSelected
                      ? filters.tags.filter((t) => t !== tag.name)
                      : [...filters.tags, tag.name];
                    setFilters({ tags: newTags });
                  }}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag.name}</span>
                </button>
              );
            })}
          </div>
          
          {filters.tags.length > 0 && (
            <button
              onClick={() => setFilters({ tags: [] })}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all tags
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
