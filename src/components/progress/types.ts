export interface UserProgress {
  user_id: string;
  user_name: string;
  user_email: string;
  user_profil_url?: string;
  total_modules: number;
  completed_modules: number;
  in_progress_modules: number;
  not_started_modules: number;
  total_materials_read: number;
  total_quiz_attempts: number;
  total_quiz_passed: number;
  total_quiz_failed: number;
  unique_quizzes_attempted: number; // NEW: Total unique quizzes attempted
  pass_rate: number; // NEW: Pass rate percentage (0-100)
  average_quiz_score: number;
  module_quiz_summary?: Array<{
    module_id: string;
    module_title: string;
    quizzes_passed: number;
    total_quizzes: number;
  }>;
  last_activity: string;
  status: "active" | "struggling" | "inactive";
  modules_progress?: ModuleProgress[];
}

export interface ModuleProgress {
  module_id: string;
  module_title: string;
  status: "not-started" | "in-progress" | "completed";
  materials_read: number;
  total_materials: number;
  quizzes_passed: number;
  total_quizzes: number;
  quiz_attempts: QuizAttempt[];
  last_accessed: string;
  overall_progress: number;
  total_time_spent: number;
}

export interface QuizAttempt {
  quiz_id: string;
  quiz_title: string;
  sub_materi_title?: string; // Sub-materi title for proper display
  score: number;
  passed: boolean;
  attempted_at: string | null;
  total_questions: number;
  correct_answers: number;
  answers: QuizAnswer[];
  is_attempted?: boolean; // Flag to indicate if quiz was actually attempted
}

export interface QuizAnswer {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface ModuleStats {
  module_id: string;
  module_title: string;
  total_completions: number;
  total_stuck: number;
  total_started: number;
  completion_rate: number;
}
