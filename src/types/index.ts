export interface Question {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating';
  question: string;
  options?: string[];
  required: boolean;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
  closedAt?: Date;
}

export interface Response {
  id: string;
  formId: string;
  answers: Record<string, string | number>;
  submittedAt: Date;
}

export interface FormStats {
  totalResponses: number;
  questionStats: Record<string, {
    type: string;
    responses: Array<{ value: string | number; count: number }>;
    textResponses?: string[];
  }>;
}

export interface AISummary {
  formId: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  generatedAt: Date;
}