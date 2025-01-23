import React from 'react';
import { PredictedPeptide } from '../types';

interface ColorCodedSequenceProps {
  sequence: string;
  peptides: PredictedPeptide[];
}

export const ColorCodedSequence: React.FC<ColorCodedSequenceProps> = ({ sequence, peptides }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'bg-red-200';
    if (score >= 0.5) return 'bg-orange-200';
    return 'bg-yellow-200';
  };

  const renderSequence = () => {
    // Sort peptides by score in descending order to prioritize higher scoring overlaps
    const sortedPeptides = [...peptides].sort((a, b) => b.score - a.score);
    
    // Create an array of characters with their styling information
    const chars = sequence.split('').map((char, index) => {
      // Find the highest scoring peptide that contains this position
      const matchingPeptide = sortedPeptides.find(
        peptide => index >= peptide.start && index <= peptide.end
      );

      // Verify that the character matches the peptide sequence
      const isPartOfPeptide = matchingPeptide && 
        char === matchingPeptide.sequence[index - matchingPeptide.start];

      return {
        char,
        peptide: isPartOfPeptide ? matchingPeptide : null,
        className: isPartOfPeptide ? getScoreColor(matchingPeptide.score) : ''
      };
    });

    // Group characters into spans of 50 for better readability
    const groups = [];
    for (let i = 0; i < chars.length; i += 50) {
      groups.push(chars.slice(i, i + 50));
    }

    return (
      <div className="font-mono text-sm">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-2">
            {group.map((char, charIndex) => (
              <span
                key={charIndex}
                className={`${char.className} px-0.5 rounded ${char.peptide ? 'cursor-help' : ''}`}
                title={char.peptide ? 
                  `Position: ${char.peptide.start + 1}-${char.peptide.end}
Epitope: ${char.peptide.sequence}
Score: ${char.peptide.score.toFixed(3)}` : ''}
              >
                {char.char}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          Predicted binding sites
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-6 w-32 bg-gradient-to-r from-yellow-200 via-orange-200 to-red-200 rounded"></div>
          <span className="text-gray-600">Binding affinity (low to high)</span>
        </div>
      </div>
      {renderSequence()}
    </div>
  );
};