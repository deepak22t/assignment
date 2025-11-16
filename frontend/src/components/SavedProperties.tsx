import React, { useState } from 'react';
import { Property } from '../types';

interface SavedPropertiesProps {
  properties: Property[];
  onSave: (propertyId: number) => void;
  onCompare: (propertyIds: number[]) => void;
  onRefresh: () => void;
}

const SavedProperties: React.FC<SavedPropertiesProps> = ({ properties, onSave, onCompare }) => {
  const [hoveredProperty, setHoveredProperty] = useState<number | null>(null);

  const handleCompare = (propertyId: number): void => {
    if (properties.length >= 2) {
      const otherProperty = properties.find((p) => p.id !== propertyId);
      if (otherProperty) {
        onCompare([propertyId, otherProperty.id]);
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg">
            ⭐
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gradient">Saved Properties</h2>
            <p className="text-gray-600 mt-1">
              {properties.length === 0
                ? 'No saved properties yet. Save properties to compare them!'
                : `You have ${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`}
            </p>
          </div>
        </div>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/20 animate-fadeIn">
          <div className="text-7xl mb-6 animate-bounce-slow">⭐</div>
          <p className="text-xl font-semibold text-gray-700 mb-2">No saved properties yet</p>
          <p className="text-gray-600">Start saving properties to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, idx) => {
            const isHovered = hoveredProperty === property.id;
            
            return (
              <div
                key={property.id}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 card-hover animate-fadeInUp"
                style={{ animationDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredProperty(property.id)}
                onMouseLeave={() => setHoveredProperty(null)}
              >
                {/* Image Section */}
                {property.images && property.images.length > 0 ? (
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isHovered ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    
                    {/* Saved Badge */}
                    <div className="absolute top-4 left-4 animate-scaleIn" style={{ animationDelay: `${idx * 100 + 200}ms` }}>
                      <div className="glass px-4 py-2 rounded-xl backdrop-blur-md border border-white/30 flex items-center gap-2">
                        <span className="text-lg">⭐</span>
                        <span className="text-sm font-bold text-white">Saved</span>
                      </div>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 animate-scaleIn" style={{ animationDelay: `${idx * 100 + 250}ms` }}>
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
                  <div className="h-64 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
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
                          className="text-xs px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-full text-orange-700 border border-orange-200 shadow-sm font-medium"
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

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {properties.length >= 2 && (
                      <button
                        onClick={() => handleCompare(property.id)}
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        ⚖️ Compare
                      </button>
                    )}
                    <button
                      onClick={() => onSave(property.id)}
                      className="px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all shadow-lg font-semibold transform hover:scale-110"
                      title="Already saved"
                    >
                      ⭐ Saved
                    </button>
                  </div>

                  {/* Hover Indicator */}
                  <div className={`h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-500 mt-3 ${
                    isHovered ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedProperties;
