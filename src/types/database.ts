export type Role = 'student' | 'admin' | 'moderator';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'boolean';
export type QuestionSourceType = 'ai_generated' | 'previous_year' | 'curated' | 'current_affairs';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type AttemptStatus = 'in_progress' | 'completed' | 'abandoned';
export type JobStatus = 'started' | 'success' | 'failed';

export interface Profile {
  id: string;
  auth_id?: string;
  mobile: string;
  display_name: string;
  avatar_url?: string;
  target_exams: string[];
  total_xp: number;
  streak_days: number;
  last_active_at: string;
  created_at: string;
  updated_at: string;
  role?: Role;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: Role;
  created_at: string;
}

export interface ExamCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  subjects_count?: number;
  quizzes_count?: number;
}

export interface ExamSubject {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order_index: number;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  subject_id?: string;
  topic_id?: string;
  difficulty: Difficulty;
  duration_minutes: number;
  total_marks: number;
  passing_percentage: number;
  negative_marking_per_wrong: number;
  is_timed: boolean;
  shuffle_questions: boolean;
  shuffle_options: boolean;
  is_published: boolean;
  published_at: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  category?: ExamCategory;
  subject?: ExamSubject;
  questions_count?: number;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id?: string;
  category_id: string;
  subject_id?: string;
  topic_id?: string;
  question_text: string;
  question_type: QuestionType;
  marks: number;
  negative_marks: number;
  explanation: string;
  difficulty: Difficulty;
  source_type: QuestionSourceType;
  source_reference?: string;
  review_status: ReviewStatus;
  is_published: boolean;
  pyq_year?: number;
  pyq_exam?: string;
  created_at: string;
  updated_at: string;
  options?: AnswerOption[];
  category?: ExamCategory;
  subject?: ExamSubject;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  started_at: string;
  completed_at?: string;
  status: AttemptStatus;
  score: number;
  total_marks: number;
  percentage: number;
  passed: boolean;
  time_taken_seconds: number;
  last_active_at: string;
  created_at: string;
  quiz?: Quiz;
  answers?: SubmittedAnswer[];
}

export interface SubmittedAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_option_id?: string;
  is_marked_for_review: boolean;
  is_correct: boolean;
  marks_awarded: number;
  answered_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
  question?: Question;
}

export interface DailyChallenge {
  id: string;
  challenge_date: string;
  question_id: string;
  category_id: string;
  title: string;
  xp_reward: number;
  created_at: string;
  question?: Question;
  completed?: boolean;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  xp_reward: number;
  created_at: string;
  unlocked?: boolean;
  unlocked_at?: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface ScheduledJobLog {
  id: string;
  job_name: string;
  status: JobStatus;
  questions_imported: number;
  questions_skipped: number;
  details: Record<string, unknown>;
  error_message?: string;
  started_at: string;
  finished_at?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id?: string;
  payload: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface OTPVerification {
  id: string;
  mobile: string;
  otp_hash: string;
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}
