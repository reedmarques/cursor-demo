# Digital Asset Management (DAM) System

A modern, production-ready Digital Asset Management system built with React and Node.js that enables teams to organize, search, and manage digital assets efficiently.

![DAM System](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Digital+Asset+Management)

## 🚀 Features

### Asset Management
- **Visual Gallery**: Grid and list view options for browsing assets
- **Asset Preview**: Full-screen lightbox modal with comprehensive metadata display
- **Metadata Editing**: Inline editing of titles, descriptions, tags, copyright, and usage rights
- **Download Assets**: Quick download functionality for any asset

### Organization
- **Collections**: Hierarchical folder structure for organizing assets
- **Tagging System**: Flexible tagging with autocomplete from existing tags
- **Custom Metadata**: Support for copyright information and usage rights
- **Bulk Operations**: Move, tag, or delete multiple assets at once

### Search & Filter
- **Full-Text Search**: Search across filenames, titles, descriptions, and tags
- **Tag Filtering**: Filter assets by one or multiple tags
- **Collection Filtering**: View assets within specific collections
- **Sorting**: Sort by name, date, or file size (ascending/descending)

### User Experience
- **Responsive Design**: Optimized for desktop and tablet devices
- **Modern UI**: Clean interface built with Tailwind CSS
- **Smooth Animations**: Professional transitions and loading states
- **Error Handling**: Comprehensive error messages and confirmations

## 📦 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Vite** for fast development and building
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **RESTful API** architecture
- **JSON file** for data persistence
- **CORS** enabled for cross-origin requests

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

4. Build for production:
```bash
npm run build
```

## 📖 Usage

### Initial Data
The application comes preloaded with:
- 5 sample images from Picsum Photos
- 3 collections (Marketing Assets, Product Photography, Brand Guidelines)
- 10 predefined tags (Nature, Technology, Architecture, etc.)

### Creating Collections
1. Click the **+** button next to "Collections" in the sidebar
2. Enter a collection name and press Enter
3. Assets can be moved to collections via the asset modal or bulk actions

### Tagging Assets
1. Click on an asset to open the detail modal
2. Click "Edit Metadata"
3. Add tags using the tag input (autocomplete available)
4. Click "Save Changes"

### Bulk Operations
1. Select multiple assets using checkboxes
2. Use the bulk actions bar at the bottom to:
   - Move assets to a collection
   - Add tags to multiple assets
   - Delete multiple assets

### Search & Filter
- Use the search bar in the header to find assets
- Filter by tags in the sidebar
- Select a collection to view only its assets
- Sort results using the dropdown menus

## 🔧 API Endpoints

### Assets
- `GET /api/assets` - Get all assets (with optional filters)
- `GET /api/assets/:id` - Get single asset
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `PATCH /api/assets/bulk` - Bulk update assets
- `POST /api/assets/bulk-delete` - Bulk delete assets

### Collections
- `GET /api/collections` - Get all collections
- `GET /api/collections/:id` - Get single collection with assets
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create tag
- `DELETE /api/tags/:id` - Delete tag

## 🎨 UI Components

### Main Components
- **Header**: Search bar, view mode toggle, and sort controls
- **Sidebar**: Collections list and tag filters
- **AssetGallery**: Grid or list view of assets
- **AssetModal**: Full-screen preview with metadata editing
- **BulkActionsBar**: Actions for selected assets

### Features
- Grid view with hover effects
- List view with detailed information
- Responsive image loading
- Smooth transitions and animations
- Loading states and error handling

## 📝 Data Persistence

Asset data is stored in `backend/data.json`. The file is automatically created on first run and updated on every change. This provides:
- Persistence across server restarts
- Easy backup and version control
- Human-readable data format

## 🚀 Future Enhancements

Potential features for future versions:
- File upload functionality
- User authentication and permissions
- Advanced search with filters
- Asset versioning
- Sharing and collaboration features
- Integration with cloud storage (S3, etc.)
- Image editing capabilities
- Asset analytics and usage tracking

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ using React and Node.js
