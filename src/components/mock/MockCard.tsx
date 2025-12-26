import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import type { MockWithSectionsDto } from '../../utils/types';

interface MockCardProps {
  mock: MockWithSectionsDto;
}

export const MockCard: React.FC<MockCardProps> = ({ mock }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/mock/${mock.id}/details`);
  };

  return (
    <Card onClick={handleClick} className="group relative overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600"></div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors pr-2">
            {mock.title}
          </h3>
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        
        {mock.description && (
          <p className="text-gray-600 mb-5 line-clamp-2 leading-relaxed">{mock.description}</p>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {mock.duration} min
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {mock.sections.length} sections
          </span>
        </div>
      </div>
    </Card>
  );
};
