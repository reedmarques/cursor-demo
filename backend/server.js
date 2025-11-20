const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data storage
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data structure
let data = {
  assets: [],
  collections: [],
  tags: []
};

// Load data from file or initialize with dummy data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileData);
      console.log('Data loaded from file');
    } else {
      initializeData();
      saveData();
      console.log('Initialized with dummy data');
    }
  } catch (error) {
    console.error('Error loading data:', error);
    initializeData();
  }
}

// Save data to file
function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Initialize with dummy data
function initializeData() {
  // Sample tags
  data.tags = [
    { id: uuidv4(), name: 'Nature' },
    { id: uuidv4(), name: 'Technology' },
    { id: uuidv4(), name: 'Architecture' },
    { id: uuidv4(), name: 'People' },
    { id: uuidv4(), name: 'Business' },
    { id: uuidv4(), name: 'Travel' },
    { id: uuidv4(), name: 'Food' },
    { id: uuidv4(), name: 'Fashion' },
    { id: uuidv4(), name: 'Abstract' },
    { id: uuidv4(), name: 'Wildlife' }
  ];

  // Sample collections
  data.collections = [
    {
      id: uuidv4(),
      name: 'Marketing Assets',
      description: 'Assets for marketing campaigns',
      createdAt: new Date('2024-01-15').toISOString()
    },
    {
      id: uuidv4(),
      name: 'Product Photography',
      description: 'Product images for e-commerce',
      createdAt: new Date('2024-02-20').toISOString()
    },
    {
      id: uuidv4(),
      name: 'Brand Guidelines',
      description: 'Brand identity and guidelines',
      createdAt: new Date('2024-03-10').toISOString()
    }
  ];

  // Sample assets with placeholder images
  const sampleAssets = [
    {
      title: 'Mountain Landscape',
      description: 'Beautiful mountain landscape at sunset',
      tags: ['Nature', 'Travel'],
      imageUrl: 'https://picsum.photos/id/1018/1920/1080',
      copyright: 'Free to use',
      usageRights: 'Commercial use allowed',
      collectionId: data.collections[0].id
    },
    {
      title: 'Modern Office Space',
      description: 'Contemporary office interior design',
      tags: ['Business', 'Architecture'],
      imageUrl: 'https://picsum.photos/id/1015/1920/1080',
      copyright: '© 2024 Company',
      usageRights: 'Internal use only',
      collectionId: data.collections[1].id
    },
    {
      title: 'Technology Workspace',
      description: 'Laptop and workspace setup',
      tags: ['Technology', 'Business'],
      imageUrl: 'https://picsum.photos/id/0/1920/1080',
      copyright: 'Creative Commons',
      usageRights: 'Attribution required',
      collectionId: data.collections[0].id
    },
    {
      title: 'Urban Architecture',
      description: 'Modern city building facade',
      tags: ['Architecture', 'Abstract'],
      imageUrl: 'https://picsum.photos/id/1080/1920/1080',
      copyright: 'Free to use',
      usageRights: 'Commercial use allowed',
      collectionId: data.collections[2].id
    },
    {
      title: 'Nature Wildlife',
      description: 'Wildlife in natural habitat',
      tags: ['Nature', 'Wildlife'],
      imageUrl: 'https://picsum.photos/id/1084/1920/1080',
      copyright: '© 2024 Photographer',
      usageRights: 'Editorial use only',
      collectionId: data.collections[2].id
    }
  ];

  data.assets = sampleAssets.map((asset, index) => ({
    id: uuidv4(),
    ...asset,
    fileName: `image-${index + 1}.jpg`,
    fileSize: Math.floor(Math.random() * 3000000) + 500000, // Random size between 500KB and 3.5MB
    dimensions: { width: 1920, height: 1080 },
    format: 'JPEG',
    uploadDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(), // Random date in last 90 days
    updatedAt: new Date().toISOString()
  }));
}

// ==================== ASSETS ENDPOINTS ====================

// Get all assets with optional filters
app.get('/api/assets', (req, res) => {
  try {
    let filteredAssets = [...data.assets];
    
    const { search, tags, collectionId, sortBy, sortOrder } = req.query;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(asset => 
        asset.title.toLowerCase().includes(searchLower) ||
        asset.description.toLowerCase().includes(searchLower) ||
        asset.fileName.toLowerCase().includes(searchLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Tags filter
    if (tags) {
      const tagArray = tags.split(',');
      filteredAssets = filteredAssets.filter(asset =>
        tagArray.some(tag => asset.tags.includes(tag))
      );
    }
    
    // Collection filter
    if (collectionId) {
      filteredAssets = filteredAssets.filter(asset => 
        asset.collectionId === collectionId
      );
    }
    
    // Sorting
    if (sortBy) {
      filteredAssets.sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'date':
            comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
            break;
          case 'size':
            comparison = a.fileSize - b.fileSize;
            break;
          default:
            comparison = 0;
        }
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    res.json(filteredAssets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single asset
app.get('/api/assets/:id', (req, res) => {
  try {
    const asset = data.assets.find(a => a.id === req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new asset
app.post('/api/assets', (req, res) => {
  try {
    const newAsset = {
      id: uuidv4(),
      ...req.body,
      uploadDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.assets.push(newAsset);
    saveData();
    
    res.status(201).json(newAsset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update asset
app.put('/api/assets/:id', (req, res) => {
  try {
    const index = data.assets.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    data.assets[index] = {
      ...data.assets[index],
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    
    saveData();
    res.json(data.assets[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete asset
app.delete('/api/assets/:id', (req, res) => {
  try {
    const index = data.assets.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    data.assets.splice(index, 1);
    saveData();
    
    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update assets
app.patch('/api/assets/bulk', (req, res) => {
  try {
    const { assetIds, updates } = req.body;
    
    if (!assetIds || !Array.isArray(assetIds)) {
      return res.status(400).json({ error: 'assetIds array is required' });
    }
    
    const updatedAssets = [];
    
    assetIds.forEach(id => {
      const index = data.assets.findIndex(a => a.id === id);
      if (index !== -1) {
        data.assets[index] = {
          ...data.assets[index],
          ...updates,
          id: id,
          updatedAt: new Date().toISOString()
        };
        updatedAssets.push(data.assets[index]);
      }
    });
    
    saveData();
    res.json(updatedAssets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk delete assets
app.post('/api/assets/bulk-delete', (req, res) => {
  try {
    const { assetIds } = req.body;
    
    if (!assetIds || !Array.isArray(assetIds)) {
      return res.status(400).json({ error: 'assetIds array is required' });
    }
    
    data.assets = data.assets.filter(asset => !assetIds.includes(asset.id));
    saveData();
    
    res.json({ message: `${assetIds.length} assets deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLLECTIONS ENDPOINTS ====================

// Get all collections
app.get('/api/collections', (req, res) => {
  try {
    res.json(data.collections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single collection
app.get('/api/collections/:id', (req, res) => {
  try {
    const collection = data.collections.find(c => c.id === req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Include assets in this collection
    const assets = data.assets.filter(a => a.collectionId === collection.id);
    
    res.json({ ...collection, assets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create collection
app.post('/api/collections', (req, res) => {
  try {
    const newCollection = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    data.collections.push(newCollection);
    saveData();
    
    res.status(201).json(newCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update collection
app.put('/api/collections/:id', (req, res) => {
  try {
    const index = data.collections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    data.collections[index] = {
      ...data.collections[index],
      ...req.body,
      id: req.params.id
    };
    
    saveData();
    res.json(data.collections[index]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete collection
app.delete('/api/collections/:id', (req, res) => {
  try {
    const index = data.collections.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    
    // Remove collection reference from assets
    data.assets.forEach(asset => {
      if (asset.collectionId === req.params.id) {
        asset.collectionId = null;
      }
    });
    
    data.collections.splice(index, 1);
    saveData();
    
    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TAGS ENDPOINTS ====================

// Get all tags
app.get('/api/tags', (req, res) => {
  try {
    res.json(data.tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tag
app.post('/api/tags', (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if tag already exists
    const existingTag = data.tags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (existingTag) {
      return res.status(400).json({ error: 'Tag already exists' });
    }
    
    const newTag = {
      id: uuidv4(),
      name
    };
    
    data.tags.push(newTag);
    saveData();
    
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete tag
app.delete('/api/tags/:id', (req, res) => {
  try {
    const index = data.tags.findIndex(t => t.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Tag not found' });
    }
    
    const tagName = data.tags[index].name;
    
    // Remove tag from all assets
    data.assets.forEach(asset => {
      asset.tags = asset.tags.filter(tag => tag !== tagName);
    });
    
    data.tags.splice(index, 1);
    saveData();
    
    res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVER START ====================

loadData();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
