import { useEffect } from 'react';
import { useStore } from './store';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AssetGallery from './components/AssetGallery';
import AssetModal from './components/AssetModal';
import BulkActionsBar from './components/BulkActionsBar';

function App() {
  const { fetchAssets, fetchCollections, fetchTags, isLoading, error, selectedAssets } = useStore();

  useEffect(() => {
    // Fetch initial data
    fetchAssets();
    fetchCollections();
    fetchTags();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          {error && (
            <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading assets...</p>
              </div>
            </div>
          ) : (
            <AssetGallery />
          )}
        </main>
      </div>
      
      {selectedAssets.size > 0 && <BulkActionsBar />}
      <AssetModal />
    </div>
  );
}

export default App;
