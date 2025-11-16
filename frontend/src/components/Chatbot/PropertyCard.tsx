/**
 * Conversational property display - integrated with agent messages
 */
import React, { useState } from 'react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
  index: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full">
        {/* Image Section - Reduced size */}
        {property.images && property.images.length > 0 ? (
          <div className="relative h-40 overflow-hidden bg-gray-100">
            {!imageLoaded && (
              <div className="absolute inset-0 skeleton animate-shimmer"></div>
            )}
            <img
              src={property.images[0]}
              alt={property.title}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {/* Price Badge - Clean and simple */}
            <div className="absolute top-2 left-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded-md shadow-lg">
                <span className="text-sm font-bold">
                  ${property.price?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
            <span className="text-4xl">🏠</span>
          </div>
        )}

        {/* Content Section - Clean and readable */}
        <div className="p-3">
          <h4 
            className="font-bold text-gray-900 mb-1 text-sm line-clamp-1 cursor-pointer"
            title={property.title}
          >
            {property.title}
          </h4>
          
          <div className="flex items-center gap-1 mb-2">
            <svg className="w-3 h-3 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-xs text-gray-600 truncate">{property.location}</p>
          </div>

          {/* Property Stats - Clean inline display */}
          <div className="flex items-center gap-3 mb-2 text-xs text-gray-600">
            <span className="flex items-center gap-0.5">
              <span className="text-xs">🛏️</span>
              <span className="font-medium">{property.bedrooms}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="text-xs">🚿</span>
              <span className="font-medium">{property.bathrooms}</span>
            </span>
            <span className="flex items-center gap-0.5">
              <span className="text-xs">📐</span>
              <span className="font-medium">{property.size}</span>
            </span>
          </div>

          {/* ML Prediction - Show if available */}
          {property.prediction && (
            <div className="mb-2 p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <p className="text-[10px] text-gray-600 mb-0.5 font-medium">🤖 ML Predicted Price</p>
              <p className="text-sm font-bold text-green-700">
                ${Math.round(property.prediction.predicted_price).toLocaleString()}
              </p>
              {property.prediction.listed_price && (
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Listed: ${property.prediction.listed_price.toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Amenities - Minimal tags */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {property.amenities.slice(0, 2).map((amenity, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PropertiesListProps {
  properties: Property[];
  onViewAll?: () => void;
}

export const PropertiesList: React.FC<PropertiesListProps> = ({ properties, onViewAll }) => {
  if (!properties || properties.length === 0) return null;

  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {properties.map((property, idx) => (
        <PropertyCard key={property.id} property={property} index={idx} />
      ))}
    </div>
  );
};

export default PropertyCard;
