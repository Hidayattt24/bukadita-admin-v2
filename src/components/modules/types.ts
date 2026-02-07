export interface ModuleItem {
  id: string | number;
  title: string;
  slug?: string;
  description?: string;
  published?: boolean;
  duration_label?: string | null;
  duration_minutes?: number | null;
  lessons?: number | null;
  category?: string | null;
  materiCount?: number;
  quizCount?: number;
  // Alternative field names from backend
  materials_count?: number;
  quiz_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ModuleFormData {
  title: string;
  description: string;
  published: boolean;
  durationLabel: string;
  durationMinutes: string;
  lessons: string;
  category: string;
}
