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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Available Mock Tests
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mt-1">Practice and excel with our comprehensive test series</p>
            </div>
          </div>
        </div>
        
        {mocks.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-700 text-xl font-bold mb-2">No mock tests available</p>
            <p className="text-gray-500 text-sm">Check back soon for new tests!</p>
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
