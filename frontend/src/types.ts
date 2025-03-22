export interface PredictedPeptide {
  id: number;
  start: number;
  end: number;
  sequence: string;
  score: number;
}

export interface AnalysisResult {
  peptides: PredictedPeptide[];
  originalSequence: string;
  timestamp: string;
}