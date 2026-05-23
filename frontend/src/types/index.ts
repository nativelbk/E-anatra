export type Role = 'STUDENT' | 'TEACHER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  level?: string;
  points?: number;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  level: Level;
  content: string;
  videoUrl?: string;
  fileUrl?: string;
  author: User;
  createdAt: string;
}

export type Subject = 'MATH' | 'SCIENCE' | 'COMPUTER_SCIENCE' | 'FRENCH' | 'HISTORY' | 'ENGLISH' | 'OTHER';
export type Level = 'PRIMARY' | 'MIDDLE' | 'HIGH' | 'UNIVERSITY';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  level: Level;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  total: number;
  answers: number[];
  completedAt: string;
}

export interface Progress {
  totalSessions: number;
  avgScore: number;
  coursesCompleted: number;
  quizzesTaken: number;
  streak: number;
  points: number;
  subjectProgress: { subject: string; score: number }[];
  recentActivity: { date: string; type: string; label: string }[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'quiz' | 'topic';
  subject: Subject;
  level: Level;
}
