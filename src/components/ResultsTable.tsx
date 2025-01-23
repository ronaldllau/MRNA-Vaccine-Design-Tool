import React from 'react';
import { PredictedPeptide } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface ResultsTableProps {
  peptides: PredictedPeptide[];
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const columns: Column[] = [
  { key: 'rank', label: 'Rank', sortable: true },
  { key: 'position', label: 'Position', sortable: true },
  { key: 'sequence', label: 'Epitope', sortable: false },
  { key: 'score', label: 'Score', sortable: true },
];

export const ResultsTable: React.FC<ResultsTableProps> = ({ peptides }) => {
  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const sortedPeptides = React.useMemo(() => {
    // Default sort by score in descending order if no sort config
    const peptidesWithRank = peptides
      .sort((a, b) => b.score - a.score)
      .map((peptide, index) => ({ ...peptide, rank: index + 1 }));

    if (!sortConfig) return peptidesWithRank;

    return [...peptidesWithRank].sort((a, b) => {
      const getValue = (item: PredictedPeptide & { rank: number }) => {
        switch (sortConfig.key) {
          case 'rank':
            return item.rank;
          case 'position':
            return item.start;
          case 'score':
            return item.score;
          default:
            return 0;
        }
      };

      const aValue = getValue(a);
      const bValue = getValue(b);

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [peptides, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider ${
                  column.sortable ? 'cursor-pointer hover:bg-blue-800' : ''
                }`}
                onClick={() => column.sortable && requestSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortConfig?.key === column.key && (
                    sortConfig.direction === 'asc' ? 
                    <ArrowUpIcon className="h-4 w-4" /> :
                    <ArrowDownIcon className="h-4 w-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedPeptides.map((peptide) => (
            <tr 
              key={peptide.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {peptide.rank}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {peptide.start + 1} - {peptide.end}
              </td>
              <td className="px-6 py-4 text-sm font-mono text-gray-900">
                {peptide.sequence}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {peptide.score.toFixed(3)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};