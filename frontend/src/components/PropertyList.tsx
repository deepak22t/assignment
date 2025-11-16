import React, { useState } from 'react';
import { propertyAPI } from '../services/api';
import { Property } from '../types';

interface PropertyListProps {
  properties: Property[];
  onSave: (propertyId: number) => void;
  onCompare: (propertyIds: number[]) => void;
}

interface Prediction {
  property_id: number;
  listed_price?: number;
  predicted_price: number;
}

const PropertyList: React.FC<PropertyListProps> = ({ properties, onSave, onCompare }) => {
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [loadingPredictions, setLoadingPredictions] = useState<Record<number, boolean>>({});
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);

  const handleSelectProperty = (propertyId: number): void => {
    setSelectedProperties((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else if (prev.length < 2) {
        return [...prev, propertyId];
      } else {
        return [prev[1], propertyId];
      }
    });
  };

  const handleCompare = (): void => {
    if (selectedProperties.length === 2) {
      onCompare(selectedProperties);
    }
  };

  const handlePredictPrice = async (propertyId: number): Promise<void> => {
    if (predictions[propertyId]) return;

    setLoadingPredictions((prev) => ({ ...prev, [propertyId]: true }));
    try {
      const response = await propertyAPI.predict(propertyId);
      setPredictions((prev) => ({
        ...prev,
        [propertyId]: response.data,
      }));
    } catch (error) {
      console.error('Prediction error:', error);
    } finally {
      setLoadingPredictions((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-4xl font-bold text-gradient mb-2">All Properties</h2>
          <p className="text-gray-600">Browse through our curated collection</p>
        </div>
        {selectedProperties.length === 2 && (
          <button
            onClick={handleCompare}
            className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 transform hover:scale-105 animate-scaleIn"
          >
            <span>⚖️ Compare Selected</span>
            <span className="px-2 py-1 bg-white/20 rounded-lg text-sm font-bold">
              {selectedProperties.length}
            </span>
          </button>
        )}
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, idx) => {
            const isSelected = selectedProperties.includes(property.id);
            const prediction = predictions[property.id];
            const isLoadingPrediction = loadingPredictions[property.id];
            const isHovered = hoveredProperty === property.id;

            return (
              <div
                key={property.id}
                className={`group relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 card-hover animate-fadeInUp ${
                  isSelected ? 'ring-4 ring-indigo-500 ring-offset-2' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {/* Image Section */}
                {property.images && property.images.length > 0 ? (
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Selection Checkbox */}
                    <div className="absolute top-4 left-4">
                      <button
                        onClick={() => handleSelectProperty(property.id)}
                        className={`w-8 h-8 rounded-lg backdrop-blur-md border-2 transition-all ${
                          isSelected
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                        } flex items-center justify-center font-bold shadow-lg`}
                      >
                        {isSelected && '✓'}
                      </button>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 animate-scaleIn" style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                      <div className="glass px-4 py-2 rounded-xl backdrop-blur-md border border-white/30">
                        <span className="text-xl font-bold text-white">
                          ${property.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-2 text-white">
                        <div className="glass px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                          <span className="text-sm">🛏️</span>
                          <span className="text-sm font-semibold">{property.bedrooms}</span>
                        </div>
                        <div className="glass px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                          <span className="text-sm">🚿</span>
                          <span className="text-sm font-semibold">{property.bathrooms}</span>
                        </div>
                        <div className="glass px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                          <span className="text-sm">📐</span>
                          <span className="text-sm font-semibold">{property.size} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl">🏠</span>
                  </div>
                )}

                {/* Content Section */}
                <div className="p-5">
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer"
                    title={property.title}
                  >
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm text-gray-600 truncate">{property.location}</p>
                  </div>

                  {/* Amenities */}
                  {property.amenities && property.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {property.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full text-indigo-700 border border-indigo-200 shadow-sm font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {property.amenities.length > 3 && (
                        <span className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 font-medium">
                          +{property.amenities.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Prediction Section */}
                  {prediction && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-scaleIn">
                      <p className="text-xs text-gray-600 mb-1 font-medium">🤖 ML Predicted Price</p>
                      <p className="text-xl font-bold text-green-700">
                        ${Math.round(prediction.predicted_price)?.toLocaleString()}
                      </p>
                      {prediction.listed_price && (
                        <p className="text-xs text-gray-500 mt-1">
                          Listed: ${prediction.listed_price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectProperty(property.id)}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {isSelected ? '✓ Selected' : 'Select'}
                    </button>
                    <button
                      onClick={() => handlePredictPrice(property.id)}
                      disabled={isLoadingPrediction || !!prediction}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        prediction
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoadingPrediction ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Predicting...</span>
                        </span>
                      ) : prediction ? (
                        '✓ Predicted'
                      ) : (
                        '🤖 Predict'
                      )}
                    </button>
                    <button
                      onClick={() => onSave(property.id)}
                      className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg font-semibold transform hover:scale-110"
                      title="Save property"
                    >
                      ⭐
                    </button>
                  </div>

                  {/* Hover Indicator */}
                  <div className={`h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 mt-3 ${
                    isHovered ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass rounded-3xl border border-white/20 animate-fadeIn">
          <div className="text-6xl mb-4 animate-bounce-slow">🏠</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">No properties found</p>
          <p className="text-gray-600">Try the chatbot to search for properties!</p>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
