export interface Option {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: string; // e.g. "m1-q1"
  moduleNumber: number;
  questionNumber: number;
  question: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  fullAnswerText: string;
}

export interface ModuleData {
  id: number;
  title: string;
  subtitle: string;
  questions: Question[];
}
