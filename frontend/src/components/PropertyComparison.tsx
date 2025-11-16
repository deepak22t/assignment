import React, { useState, useEffect, useCallback } from 'react';
import { propertyAPI } from '../services/api';
import { ComparisonResponse } from '../types';

interface PropertyComparisonProps {
  propertyIds: number[];
  onBack: () => void;
}

interface ComparisonField {
  label: string;
  key: string;
  format?: (val: any) => string;
}

const PropertyComparison: React.FC<PropertyComparisonProps> = ({ propertyIds, onBack }) => {
  const [comparison, setComparison] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await propertyAPI.compare(propertyIds);
      setComparison(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch comparison data');
      console.error('Comparison error:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyIds]);

  useEffect(() => {
    if (propertyIds && propertyIds.length === 2) {
      fetchComparison();
    } else if (propertyIds && propertyIds.length > 0) {
      setError('Please select exactly 2 properties to compare. You can select properties from the "All Properties" tab.');
      setLoading(false);
    } else {
      setError('No properties selected for comparison. Please select 2 properties from the "All Properties" tab.');
      setLoading(false);
    }
  }, [propertyIds, fetchComparison]);

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading comparison...</p>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || 'Comparison data not available'}</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { property1, property2 } = comparison;

  const comparisonFields: ComparisonField[] = [
    { label: 'Title', key: 'title' },
    { label: 'Location', key: 'location' },
    { label: 'Price', key: 'price', format: (val) => `$${val?.toLocaleString()}` },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Size (sqft)', key: 'size' },
    {
      label: 'Predicted Price',
      key: 'prediction.predicted_price',
      format: (val) => val ? `$${Math.round(val).toLocaleString()}` : 'N/A',
    },
    {
      label: 'Listed Price',
      key: 'prediction.listed_price',
      format: (val) => val ? `$${val.toLocaleString()}` : 'N/A',
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Property Comparison</h2>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Property 1 */}
          <div className="border-r border-gray-200">
            <div className="p-6 bg-indigo-50">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {property1.title}
              </h3>
              {property1.images && property1.images.length > 0 && (
                <img
                  src={property1.images[0]}
                  alt={property1.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
            </div>
            <div className="p-6">
              {comparisonFields.map((field) => {
                const value = getNestedValue(property1, field.key);
                const displayValue = field.format ? field.format(value) : value;
                return (
                  <div key={field.key} className="mb-4 pb-4 border-b border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                    <p className="text-lg font-semibold text-gray-800">{displayValue || 'N/A'}</p>
                  </div>
                );
              })}
              {property1.amenities && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {property1.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Property 2 */}
          <div>
            <div className="p-6 bg-green-50">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {property2.title}
              </h3>
              {property2.images && property2.images.length > 0 && (
                <img
                  src={property2.images[0]}
                  alt={property2.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
            </div>
            <div className="p-6">
              {comparisonFields.map((field) => {
                const value = getNestedValue(property2, field.key);
                const displayValue = field.format ? field.format(value) : value;
                const prop1Value = getNestedValue(property1, field.key);
                
                // Highlight differences
                const isDifferent = value !== prop1Value && 
                  (typeof value === 'number' || typeof prop1Value === 'number');
                const isBetter = typeof value === 'number' && typeof prop1Value === 'number' &&
                  (field.key.includes('price') ? value < prop1Value : value > prop1Value);

                return (
                  <div key={field.key} className={`mb-4 pb-4 border-b border-gray-100 ${isDifferent ? 'bg-green-50' : ''}`}>
                    <p className="text-sm text-gray-600 mb-1">{field.label}</p>
                    <p className={`text-lg font-semibold ${isBetter ? 'text-green-600' : 'text-gray-800'}`}>
                      {displayValue || 'N/A'}
                      {isBetter && ' ✓'}
                    </p>
                  </div>
                );
              })}
              {property2.amenities && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {property2.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison;

