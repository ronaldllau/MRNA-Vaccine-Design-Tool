import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResultsTable } from '../components/ResultsTable';
import { ColorCodedSequence } from '../components/ColorCodedSequence';
import { AnalysisResult } from '../types';
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as AnalysisResult;

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">No results available</h2>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Input
          </button>
        </div>
      </div>
    );
  }

  const downloadResults = () => {
    const sortedPeptides = [...result.peptides]
      .sort((a, b) => b.score - a.score)
      .map((peptide, index) => ({ ...peptide, rank: index + 1 }));

    const csvContent = [
      ['Rank', 'Position', 'Epitope', 'Score'].join(','),
      ...sortedPeptides.map(p => 
        [p.rank, `${p.start + 1}-${p.end}`, p.sequence, p.score.toFixed(3)].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `epitope-predictions-${result.timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Predicted Antigenic Epitopes
            </h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Input
              </button>
              <button
                onClick={downloadResults}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download Results
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <ColorCodedSequence 
              sequence={result.originalSequence}
              peptides={result.peptides}
            />
            <ResultsTable peptides={result.peptides} />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-500">
            Analysis completed at: {new Date(result.timestamp).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};