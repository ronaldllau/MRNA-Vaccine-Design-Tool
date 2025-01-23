import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Results } from './pages/Results';

// Valid amino acid single-letter codes
const VALID_AMINO_ACIDS = new Set('ACDEFGHIKLMNPQRSTVWY');

// Function to find binding sites in the sequence
const findBindingSites = (sequence: string) => {
  // This is a mock implementation that finds actual subsequences
  // In a real implementation, this would use a proper algorithm to identify binding sites
  
  const sites = [
    { start: 10, end: 29 },  // Example binding regions
    { start: 45, end: 64 },
    { start: 120, end: 139 }
  ];
  
  return sites.map((site, index) => ({
    id: index + 1,
    start: site.start,
    end: site.end,
    sequence: sequence.substring(site.start, site.end + 1),
    score: Math.random() * 0.5 + 0.5  // Random score between 0.5 and 1.0 for demonstration
  }));
};

function InputForm() {
  const navigate = useNavigate();
  const [sequence, setSequence] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const validateSequence = (input: string) => {
    const upperInput = input.replace(/\s/g, '').toUpperCase();
    return Array.from(upperInput).every(char => VALID_AMINO_ACIDS.has(char));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSequence = sequence.trim().toUpperCase();
    
    if (!trimmedSequence) {
      setError('Please enter a protein sequence.');
      return;
    }

    if (!validateSequence(trimmedSequence)) {
      setError('Invalid sequence. Please use only valid single-letter amino acid codes (A-Y).');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const peptides = findBindingSites(trimmedSequence);
      const result = {
        peptides,
        originalSequence: trimmedSequence,
        timestamp: new Date().toISOString()
      };

      navigate('/results', { state: result });
    } catch (err) {
      setError('An error occurred while processing your sequence. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSequence('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Protein Sequence Input
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="sequence" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Protein Sequence
              </label>
              <textarea
                id="sequence"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Enter your protein sequence here (single-letter amino acid codes)"
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                spellCheck="false"
                disabled={isProcessing}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  {error}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isProcessing}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {isProcessing ? 'Processing...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={isProcessing}
                className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InputForm />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;