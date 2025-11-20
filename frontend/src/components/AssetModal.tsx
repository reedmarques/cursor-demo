import { useState, useEffect } from 'react';
import { X, Download, Trash2, Save, Tag, Plus, Folder } from 'lucide-react';
import { useStore } from '../store';
import { formatFileSize, formatDate, formatDateTime } from '../utils';

export default function AssetModal() {
  const { selectedAsset, setSelectedAsset, updateAsset, deleteAsset, collections, tags, createTag } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    copyright: '',
    usageRights: '',
    collectionId: '',
  });
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  const handleClose = () => {
    setSelectedAsset(null);
    setIsEditing(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    if (selectedAsset) {
      setFormData({
        title: selectedAsset.title,
        description: selectedAsset.description,
        tags: selectedAsset.tags,
        copyright: selectedAsset.copyright,
        usageRights: selectedAsset.usageRights,
        collectionId: selectedAsset.collectionId || '',
      });
      setIsEditing(false);
    }
  }, [selectedAsset]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (selectedAsset) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedAsset]);

  if (!selectedAsset) return null;

  const handleSave = async () => {
    await updateAsset(selectedAsset.id, formData);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      await deleteAsset(selectedAsset.id);
      handleClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = selectedAsset.imageUrl;
    link.download = selectedAsset.fileName;
    link.click();
  };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      // Check if tag exists
      const existingTag = tags.find((t) => t.name.toLowerCase() === newTag.toLowerCase());
      if (!existingTag) {
        await createTag(newTag);
      }
      
      if (!formData.tags.includes(newTag)) {
        setFormData({ ...formData, tags: [...formData.tags, newTag] });
      }
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex overflow-hidden shadow-2xl animate-slide-up">
        {/* Image Preview */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-8">
          <img
            src={selectedAsset.imageUrl}
            alt={selectedAsset.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
        
        {/* Details Panel */}
        <div className="w-96 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Asset Details</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{selectedAsset.title}</p>
              )}
            </div>
            
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              {isEditing ? (
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{selectedAsset.description}</p>
              )}
            </div>
            
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(isEditing ? formData.tags : selectedAsset.tags).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-blue-200 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              
              {isEditing && (
                <>
                  {showTagInput ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                        list="available-tags"
                        placeholder="Enter tag name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <datalist id="available-tags">
                        {tags.map((tag) => (
                          <option key={tag.id} value={tag.name} />
                        ))}
                      </datalist>
                      <button
                        onClick={handleAddTag}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowTagInput(false);
                          setNewTag('');
                        }}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowTagInput(true)}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add tag</span>
                    </button>
                  )}
                </>
              )}
            </div>
            
            {/* Collection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
              {isEditing ? (
                <select
                  value={formData.collectionId}
                  onChange={(e) => setFormData({ ...formData, collectionId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No collection</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-900">
                  {collections.find((c) => c.id === selectedAsset.collectionId)?.name || 'No collection'}
                </p>
              )}
            </div>
            
            {/* Copyright */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.copyright}
                  onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{selectedAsset.copyright}</p>
              )}
            </div>
            
            {/* Usage Rights */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Rights</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.usageRights}
                  onChange={(e) => setFormData({ ...formData, usageRights: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{selectedAsset.usageRights}</p>
              )}
            </div>
            
            {/* File Info */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">File Information</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">File name:</span>
                  <span className="text-gray-900 font-medium">{selectedAsset.fileName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="text-gray-900 font-medium">{selectedAsset.format}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="text-gray-900 font-medium">
                    {selectedAsset.dimensions.width} × {selectedAsset.dimensions.height}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File size:</span>
                  <span className="text-gray-900 font-medium">{formatFileSize(selectedAsset.fileSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uploaded:</span>
                  <span className="text-gray-900 font-medium">{formatDate(selectedAsset.uploadDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Modified:</span>
                  <span className="text-gray-900 font-medium">{formatDateTime(selectedAsset.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="border-t border-gray-200 p-4 space-y-2">
            {isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      title: selectedAsset.title,
                      description: selectedAsset.description,
                      tags: selectedAsset.tags,
                      copyright: selectedAsset.copyright,
                      usageRights: selectedAsset.usageRights,
                      collectionId: selectedAsset.collectionId || '',
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Metadata
              </button>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

