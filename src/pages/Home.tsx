import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMocks } from '../store/slices/mockSlice';
import { MockCard } from '../components/mock/MockCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mocks, loading, error } = useAppSelector((state) => state.mock);

  useEffect(() => {
    dispatch(fetchMocks());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Mock Tests</h1>
        
        {mocks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mock tests available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mocks.map((mock) => (
              <MockCard key={mock.id} mock={mock} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
