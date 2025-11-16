import React, { useState, useEffect } from 'react';
import Chatbot from './components/Chatbot';
import PropertyList from './components/PropertyList';
import PropertyComparison from './components/PropertyComparison';
import SavedProperties from './components/SavedProperties';
import { propertyAPI } from './services/api';
import { Property } from './types';
import './App.css';

type TabType = 'chatbot' | 'properties' | 'saved' | 'compare';

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [comparisonProperties, setComparisonProperties] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('chatbot');

  useEffect(() => {
    fetchAllProperties();
    fetchSavedProperties();
  }, []);

  const fetchAllProperties = async (): Promise<void> => {
    try {
      const response = await propertyAPI.getAll();
      setProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchSavedProperties = async (): Promise<void> => {
    try {
      const response = await propertyAPI.getSaved();
      setSavedProperties(response.data.properties || []);
    } catch (error) {
      console.error('Error fetching saved properties:', error);
    }
  };

  const handleSaveProperty = async (propertyId: number): Promise<void> => {
    try {
      const response = await propertyAPI.save(propertyId);
      if (response.data.message === 'Property saved') {
        fetchSavedProperties();
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleCompareProperties = (propertyIds: number[]): void => {
    if (propertyIds && propertyIds.length === 2) {
      setComparisonProperties(propertyIds);
      setActiveTab('compare');
    } else {
      console.warn('Need exactly 2 properties to compare');
    }
  };

  const handleViewProperties = (): void => {
    setActiveTab('properties');
    fetchAllProperties();
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Modern Header with Title and Tabs */}
      <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-lg backdrop-blur-xl bg-white/80">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-md">
                🏠
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Real Estate Chatbot
                </h1>
                <p className="text-gray-600 text-xs">Find your perfect home with intelligent assistance</p>
              </div>
            </div>

            {/* Right Side - Navigation Tabs */}
            <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('chatbot')}
                className={`group relative px-4 py-2 font-semibold transition-all duration-300 whitespace-nowrap rounded-lg text-sm ${
                  activeTab === 'chatbot'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">💬</span>
                  <span>Chatbot</span>
                </span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('properties');
                  fetchAllProperties();
                }}
                className={`group relative px-4 py-2 font-semibold transition-all duration-300 whitespace-nowrap rounded-lg text-sm ${
                  activeTab === 'properties'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">🏘️</span>
                  <span>Properties</span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`group relative px-4 py-2 font-semibold transition-all duration-300 whitespace-nowrap rounded-lg text-sm ${
                  activeTab === 'saved'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">⭐</span>
                  <span>Saved</span>
                  {savedProperties.length > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full font-bold ${
                      activeTab === 'saved' 
                        ? 'bg-white/30 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {savedProperties.length}
                    </span>
                  )}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={`group relative px-4 py-2 font-semibold transition-all duration-300 whitespace-nowrap rounded-lg text-sm ${
                  activeTab === 'compare'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">⚖️</span>
                  <span>Compare</span>
                </span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content with smooth transitions */}
      <main className={`relative flex-1 min-h-0 ${activeTab === 'chatbot' ? '' : 'container mx-auto px-4 py-4 overflow-y-auto'}`}>
        <div className={`animate-fadeIn ${activeTab === 'chatbot' ? 'h-full' : ''}`}>
          {activeTab === 'chatbot' && (
            <Chatbot
              onPropertiesFound={(props: Property[]) => setProperties(props)}
              onViewProperties={handleViewProperties}
            />
          )}
          {activeTab === 'properties' && (
            <div className="animate-scaleIn">
              <PropertyList
                properties={properties}
                onSave={handleSaveProperty}
                onCompare={handleCompareProperties}
              />
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="animate-scaleIn">
              <SavedProperties
                properties={savedProperties}
                onSave={handleSaveProperty}
                onCompare={handleCompareProperties}
                onRefresh={fetchSavedProperties}
              />
            </div>
          )}
          {activeTab === 'compare' && (
            <div className="animate-scaleIn">
              <PropertyComparison
                propertyIds={comparisonProperties}
                onBack={() => setActiveTab('properties')}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className={`glass border-t border-white/20 py-2 backdrop-blur-xl ${activeTab === 'chatbot' ? 'mt-0' : 'mt-8'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <p className="text-gray-600 text-xs font-medium text-center">Real Estate AI - Powered by Advanced ML & AI</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

