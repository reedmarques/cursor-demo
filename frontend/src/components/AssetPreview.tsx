import { useState, useEffect } from 'react';
import { useStore } from '../store';
import type { Asset } from '../types';

interface AssetPreviewProps {
  assetId: string;
  onClose: () => void;
}

export default function AssetPreview({ assetId, onClose }: AssetPreviewProps) {
  const { assets, updateAsset, tags, createTag } = useStore();
  const asset = assets.find((a) => a.id === assetId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAsset, setEditedAsset] = useState<Partial<Asset> | null>(null);
  const [newTag, setNewTag] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (asset) {
      setEditedAsset({
        title: asset.title,
        description: asset.description,
        tags: [...asset.tags],
        metadata: { ...asset.metadata },
      });
    }
  }, [asset]);

  useEffect(() => {
    if (newTag && asset) {
      const filtered = tags.filter(
        (tag) =>
          tag.toLowerCase().includes(newTag.toLowerCase()) &&
          !asset.tags.includes(tag)
      );
      setTagSuggestions(filtered);
    } else {
      setTagSuggestions([]);
    }
  }, [newTag, tags, asset]);

  if (!asset || !editedAsset) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSave = async () => {
    if (editedAsset) {
      await updateAsset(assetId, editedAsset);
      setIsEditing(false);
    }
  };

  const handleAddTag = async (tag: string) => {
    if (!editedAsset.tags?.includes(tag)) {
      const newTags = [...(editedAsset.tags || []), tag];
      setEditedAsset({ ...editedAsset, tags: newTags });
      setNewTag('');
      setTagSuggestions([]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (editedAsset.tags) {
      setEditedAsset({
        ...editedAsset,
        tags: editedAsset.tags.filter((t) => t !== tagToRemove),
      });
    }
  };

  const handleCreateAndAddTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      await createTag(newTag.trim());
    }
    if (newTag.trim()) {
      handleAddTag(newTag.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Asset' : 'Asset Details'}
          </h2>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedAsset({
                      title: asset.title,
                      description: asset.description,
                      tags: [...asset.tags],
                      metadata: { ...asset.metadata },
                    });
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={asset.url}
                alt={asset.title}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Metadata */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedAsset.title || ''}
                    onChange={(e) =>
                      setEditedAsset({ ...editedAsset, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{asset.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={editedAsset.description || ''}
                    onChange={(e) =>
                      setEditedAsset({ ...editedAsset, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700">{asset.description}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editedAsset.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="relative">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (tagSuggestions.length > 0) {
                            handleAddTag(tagSuggestions[0]);
                          } else {
                            handleCreateAndAddTag();
                          }
                        }
                      }}
                      placeholder="Add tag..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {tagSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                        {tagSuggestions.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleAddTag(tag)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                    {newTag && tagSuggestions.length === 0 && (
                      <button
                        onClick={handleCreateAndAddTag}
                        className="absolute right-2 top-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add "{newTag}"
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Metadata Details */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">File Information</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-gray-500">Dimensions</dt>
                    <dd className="text-gray-900 font-medium">
                      {asset.metadata.dimensions.width} × {asset.metadata.dimensions.height}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">File Size</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatFileSize(asset.metadata.fileSize)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Format</dt>
                    <dd className="text-gray-900 font-medium">{asset.metadata.format}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Upload Date</dt>
                    <dd className="text-gray-900 font-medium">{formatDate(asset.uploadDate)}</dd>
                  </div>
                </dl>
              </div>

              {/* Copyright & Usage Rights */}
              {isEditing ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Copyright
                    </label>
                    <input
                      type="text"
                      value={editedAsset.metadata?.copyright || ''}
                      onChange={(e) =>
                        setEditedAsset({
                          ...editedAsset,
                          metadata: {
                            ...editedAsset.metadata!,
                            copyright: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage Rights
                    </label>
                    <input
                      type="text"
                      value={editedAsset.metadata?.usageRights || ''}
                      onChange={(e) =>
                        setEditedAsset({
                          ...editedAsset,
                          metadata: {
                            ...editedAsset.metadata!,
                            usageRights: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Rights</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Copyright</dt>
                      <dd className="text-gray-900">{asset.metadata.copyright}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Usage Rights</dt>
                      <dd className="text-gray-900">{asset.metadata.usageRights}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Download Button */}
              <div className="pt-4">
                <a
                  href={asset.url}
                  download={asset.filename}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

