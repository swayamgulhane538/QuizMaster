import fs from "fs";
import path from "path";
import {
  Profile,
  Role,
  ExamCategory,
  ExamSubject,
  Topic,
  Quiz,
  Question,
  AnswerOption,
  QuizAttempt,
  SubmittedAnswer,
  Bookmark,
  DailyChallenge,
  Achievement,
  UserAchievement,
  ScheduledJobLog,
  AdminAuditLog,
  OTPVerification,
} from "@/types/database";
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_CATEGORIES,
  INITIAL_SUBJECTS,
  INITIAL_QUIZZES,
  INITIAL_QUESTIONS,
} from "./seed-data";

interface DatabaseSchema {
  profiles: Profile[];
  user_roles: { id: string; user_id: string; role: Role; created_at: string }[];
  exam_categories: ExamCategory[];
  exam_subjects: ExamSubject[];
  topics: Topic[];
  quizzes: Quiz[];
  questions: Question[];
  answer_options: AnswerOption[];
  quiz_attempts: QuizAttempt[];
  submitted_answers: SubmittedAnswer[];
  bookmarks: Bookmark[];
  daily_challenges: DailyChallenge[];
  achievements: Achievement[];
  user_achievements: UserAchievement[];
  scheduled_job_logs: ScheduledJobLog[];
  admin_audit_logs: AdminAuditLog[];
  otp_verifications: OTPVerification[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "quizmaster.db.json");

class DatabaseStore {
  private data: DatabaseSchema | null = null;

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    this.ensureDir();
    if (this.data) return this.data;

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        return this.data!;
      } catch (err) {
        console.error("Failed to parse DB file, initializing fresh:", err);
      }
    }

    // Initialize with seed data
    const initialOptions: AnswerOption[] = [];
    INITIAL_QUESTIONS.forEach((q) => {
      if (q.options) {
        initialOptions.push(...q.options);
      }
    });

    const todayStr = new Date().toISOString().split("T")[0];
    const initialDailyChallenges: DailyChallenge[] = [
      {
        id: "daily-ch-1",
        challenge_date: todayStr,
        question_id: "q-qotd-1",
        category_id: "cat-upsc",
        title: "Constitution & Polity Daily Master",
        xp_reward: 50,
        created_at: new Date().toISOString(),
      },
    ];

    // Seed default admin profile
    const defaultAdmin: Profile = {
      id: "admin-master-user",
      mobile: "+919876543210",
      display_name: "QuizMaster Admin",
      avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      target_exams: ["UPSC Civil Services", "SSC Examinations"],
      total_xp: 1500,
      streak_days: 12,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      role: "admin",
    };

    const initialSchema: DatabaseSchema = {
      profiles: [defaultAdmin],
      user_roles: [{ id: "ur-admin-1", user_id: defaultAdmin.id, role: "admin", created_at: new Date().toISOString() }],
      exam_categories: INITIAL_CATEGORIES,
      exam_subjects: INITIAL_SUBJECTS,
      topics: [],
      quizzes: INITIAL_QUIZZES,
      questions: INITIAL_QUESTIONS,
      answer_options: initialOptions,
      quiz_attempts: [],
      submitted_answers: [],
      bookmarks: [],
      daily_challenges: initialDailyChallenges,
      achievements: INITIAL_ACHIEVEMENTS,
      user_achievements: [],
      scheduled_job_logs: [],
      admin_audit_logs: [],
      otp_verifications: [],
    };

    this.data = initialSchema;
    this.save();
    return this.data;
  }

  private save() {
    this.ensureDir();
    if (!this.data) return;
    const tmp = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2), "utf-8");
    fs.renameSync(tmp, DB_FILE);
  }

  // --- Profiles & Roles ---
  async getProfileByMobile(mobile: string): Promise<Profile | null> {
    const db = this.load();
    const cleanMobile = mobile.replace(/\s+/g, "");
    const profile = db.profiles.find((p) => p.mobile.replace(/\s+/g, "") === cleanMobile);
    if (!profile) return null;
    const roleRecord = db.user_roles.find((r) => r.user_id === profile.id);
    return { ...profile, role: roleRecord ? roleRecord.role : "student" };
  }

  async getProfileById(id: string): Promise<Profile | null> {
    const db = this.load();
    const profile = db.profiles.find((p) => p.id === id);
    if (!profile) return null;
    const roleRecord = db.user_roles.find((r) => r.user_id === profile.id);
    return { ...profile, role: roleRecord ? roleRecord.role : "student" };
  }

  async upsertProfile(data: Partial<Profile> & { mobile: string }): Promise<Profile> {
    const db = this.load();
    const cleanMobile = data.mobile.replace(/\s+/g, "");
    let profile = db.profiles.find((p) => p.mobile.replace(/\s+/g, "") === cleanMobile);

    if (profile) {
      Object.assign(profile, {
        ...data,
        updated_at: new Date().toISOString(),
        last_active_at: new Date().toISOString(),
      });
    } else {
      profile = {
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        mobile: cleanMobile,
        display_name: data.display_name || `Aspirant_${cleanMobile.slice(-4)}`,
        avatar_url: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanMobile}`,
        target_exams: data.target_exams || ["General Learning & Current Affairs"],
        total_xp: 0,
        streak_days: 1,
        last_active_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(profile);
      db.user_roles.push({
        id: `ur-${Date.now()}`,
        user_id: profile.id,
        role: (data.role as Role) || "student",
        created_at: new Date().toISOString(),
      });
    }

    this.save();
    const roleRecord = db.user_roles.find((r) => r.user_id === profile!.id);
    return { ...profile, role: roleRecord ? roleRecord.role : "student" };
  }

  async getAllProfiles(): Promise<Profile[]> {
    const db = this.load();
    return db.profiles.map((p) => {
      const roleRecord = db.user_roles.find((r) => r.user_id === p.id);
      return { ...p, role: roleRecord ? roleRecord.role : "student" };
    });
  }

  // --- Exam Categories & Subjects ---
  async getCategories(): Promise<ExamCategory[]> {
    const db = this.load();
    return db.exam_categories
      .filter((c) => c.is_active)
      .sort((a, b) => a.order_index - b.order_index)
      .map((cat) => ({
        ...cat,
        subjects_count: db.exam_subjects.filter((s) => s.category_id === cat.id).length,
        quizzes_count: db.quizzes.filter((q) => q.category_id === cat.id && q.is_published).length,
      }));
  }

  async getCategoryBySlug(slug: string): Promise<ExamCategory | null> {
    const db = this.load();
    const cat = db.exam_categories.find((c) => c.slug === slug);
    if (!cat) return null;
    return {
      ...cat,
      subjects_count: db.exam_subjects.filter((s) => s.category_id === cat.id).length,
      quizzes_count: db.quizzes.filter((q) => q.category_id === cat.id && q.is_published).length,
    };
  }

  async getSubjects(categoryId?: string): Promise<ExamSubject[]> {
    const db = this.load();
    if (categoryId) {
      return db.exam_subjects.filter((s) => s.category_id === categoryId);
    }
    return db.exam_subjects;
  }

  // --- Quizzes ---
  async getQuizzes(filters?: {
    categoryId?: string;
    subjectId?: string;
    difficulty?: string;
    publishedOnly?: boolean;
    search?: string;
  }): Promise<Quiz[]> {
    const db = this.load();
    let result = db.quizzes;

    if (filters?.publishedOnly !== false) {
      result = result.filter((q) => q.is_published);
    }
    if (filters?.categoryId) {
      result = result.filter((q) => q.category_id === filters.categoryId);
    }
    if (filters?.subjectId) {
      result = result.filter((q) => q.subject_id === filters.subjectId);
    }
    if (filters?.difficulty) {
      result = result.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (x) => x.title.toLowerCase().includes(q) || (x.description && x.description.toLowerCase().includes(q))
      );
    }

    return result.map((quiz) => ({
      ...quiz,
      category: db.exam_categories.find((c) => c.id === quiz.category_id),
      subject: db.exam_subjects.find((s) => s.id === quiz.subject_id),
      questions_count: db.questions.filter((q) => q.quiz_id === quiz.id && q.review_status === "approved").length,
    }));
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    const db = this.load();
    const quiz = db.quizzes.find((q) => q.id === id || q.slug === id);
    if (!quiz) return null;
    return {
      ...quiz,
      category: db.exam_categories.find((c) => c.id === quiz.category_id),
      subject: db.exam_subjects.find((s) => s.id === quiz.subject_id),
      questions_count: db.questions.filter((q) => q.quiz_id === quiz.id && q.review_status === "approved").length,
    };
  }

  async createQuiz(data: Omit<Quiz, "id" | "created_at" | "updated_at">): Promise<Quiz> {
    const db = this.load();
    const newQuiz: Quiz = {
      ...data,
      id: `quiz-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.quizzes.push(newQuiz);
    this.save();
    return newQuiz;
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz | null> {
    const db = this.load();
    const quiz = db.quizzes.find((q) => q.id === id);
    if (!quiz) return null;
    Object.assign(quiz, data, { updated_at: new Date().toISOString() });
    this.save();
    return quiz;
  }

  // --- Questions & Answers ---
  async getQuestions(filters?: {
    quizId?: string;
    categoryId?: string;
    reviewStatus?: string;
    isPublished?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    hideCorrectAnswers?: boolean;
  }): Promise<Question[]> {
    const db = this.load();
    let result = db.questions;

    if (filters?.quizId) {
      result = result.filter((q) => q.quiz_id === filters.quizId);
    }
    if (filters?.categoryId) {
      result = result.filter((q) => q.category_id === filters.categoryId);
    }
    if (filters?.reviewStatus) {
      result = result.filter((q) => q.review_status === filters.reviewStatus);
    }
    if (filters?.isPublished !== undefined) {
      result = result.filter((q) => q.is_published === filters.isPublished);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((q) => q.question_text.toLowerCase().includes(s));
    }

    // Attach options
    return result.map((q) => {
      let options = db.answer_options
        .filter((opt) => opt.question_id === q.id)
        .sort((a, b) => a.order_index - b.order_index);

      if (filters?.hideCorrectAnswers) {
        options = options.map((opt) => ({
          ...opt,
          is_correct: false, // Hidden during active quiz to prevent cheating
        }));
      }

      return {
        ...q,
        options,
        category: db.exam_categories.find((c) => c.id === q.category_id),
        subject: db.exam_subjects.find((s) => s.id === q.subject_id),
      };
    });
  }

  async getQuestionById(id: string, hideCorrectAnswers = false): Promise<Question | null> {
    const db = this.load();
    const question = db.questions.find((q) => q.id === id);
    if (!question) return null;

    let options = db.answer_options
      .filter((opt) => opt.question_id === question.id)
      .sort((a, b) => a.order_index - b.order_index);

    if (hideCorrectAnswers) {
      options = options.map((opt) => ({ ...opt, is_correct: false }));
    }

    return {
      ...question,
      options,
      category: db.exam_categories.find((c) => c.id === question.category_id),
      subject: db.exam_subjects.find((s) => s.id === question.subject_id),
    };
  }

  async createQuestion(
    questionData: Omit<Question, "id" | "created_at" | "updated_at">,
    optionsData: { option_text: string; is_correct: boolean; order_index: number }[]
  ): Promise<Question> {
    const db = this.load();
    const qId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newQuestion: Question = {
      ...questionData,
      id: qId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newOptions: AnswerOption[] = optionsData.map((opt, idx) => ({
      id: `opt-${qId}-${idx + 1}`,
      question_id: qId,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      order_index: opt.order_index || idx + 1,
      created_at: new Date().toISOString(),
    }));

    db.questions.push(newQuestion);
    db.answer_options.push(...newOptions);
    this.save();

    return { ...newQuestion, options: newOptions };
  }

  async updateQuestionStatus(id: string, reviewStatus: "approved" | "rejected", isPublished?: boolean): Promise<boolean> {
    const db = this.load();
    const q = db.questions.find((x) => x.id === id);
    if (!q) return false;
    q.review_status = reviewStatus;
    if (isPublished !== undefined) {
      q.is_published = isPublished;
    } else if (reviewStatus === "approved") {
      q.is_published = true;
    }
    q.updated_at = new Date().toISOString();
    this.save();
    return true;
  }

  // --- Quiz Attempts & Scoring ---
  async startQuizAttempt(userId: string, quizId: string): Promise<QuizAttempt> {
    const db = this.load();
    const quiz = await this.getQuizById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    // Check if there is an in-progress attempt that is still active
    const existing = db.quiz_attempts.find(
      (a) => a.user_id === userId && a.quiz_id === quizId && a.status === "in_progress"
    );

    if (existing) {
      const elapsedSeconds = Math.floor((Date.now() - new Date(existing.started_at).getTime()) / 1000);
      const totalAllowedSeconds = quiz.duration_minutes * 60;
      if (elapsedSeconds < totalAllowedSeconds) {
        existing.last_active_at = new Date().toISOString();
        this.save();
        return existing;
      } else {
        // Expired, mark as abandoned or completed
        existing.status = "abandoned";
      }
    }

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quiz_id: quizId,
      user_id: userId,
      started_at: new Date().toISOString(),
      status: "in_progress",
      score: 0,
      total_marks: quiz.total_marks,
      percentage: 0,
      passed: false,
      time_taken_seconds: 0,
      last_active_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    db.quiz_attempts.push(attempt);
    this.save();
    return attempt;
  }

  async getQuizAttempt(attemptId: string): Promise<QuizAttempt | null> {
    const db = this.load();
    const attempt = db.quiz_attempts.find((a) => a.id === attemptId);
    if (!attempt) return null;
    const quiz = await this.getQuizById(attempt.quiz_id);
    const answers = db.submitted_answers.filter((sa) => sa.attempt_id === attemptId);
    return { ...attempt, quiz: quiz || undefined, answers };
  }

  async saveAttemptProgress(
    attemptId: string,
    answers: { question_id: string; selected_option_id?: string; is_marked_for_review: boolean }[]
  ): Promise<boolean> {
    const db = this.load();
    const attempt = db.quiz_attempts.find((a) => a.id === attemptId && a.status === "in_progress");
    if (!attempt) return false;

    attempt.last_active_at = new Date().toISOString();

    for (const ans of answers) {
      let existingAns = db.submitted_answers.find(
        (sa) => sa.attempt_id === attemptId && sa.question_id === ans.question_id
      );

      if (existingAns) {
        existingAns.selected_option_id = ans.selected_option_id;
        existingAns.is_marked_for_review = ans.is_marked_for_review;
        existingAns.answered_at = new Date().toISOString();
      } else {
        db.submitted_answers.push({
          id: `ans-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          attempt_id: attemptId,
          question_id: ans.question_id,
          selected_option_id: ans.selected_option_id,
          is_marked_for_review: ans.is_marked_for_review,
          is_correct: false,
          marks_awarded: 0,
          answered_at: new Date().toISOString(),
        });
      }
    }

    this.save();
    return true;
  }

  async submitQuizAttempt(
    attemptId: string,
    timeTakenSeconds: number,
    finalAnswers?: { question_id: string; selected_option_id?: string; is_marked_for_review: boolean }[]
  ): Promise<QuizAttempt> {
    const db = this.load();
    const attempt = db.quiz_attempts.find((a) => a.id === attemptId);
    if (!attempt) throw new Error("Attempt not found");
    if (attempt.status === "completed") {
      return (await this.getQuizAttempt(attemptId))!;
    }

    if (finalAnswers && finalAnswers.length > 0) {
      await this.saveAttemptProgress(attemptId, finalAnswers);
    }

    const quiz = await this.getQuizById(attempt.quiz_id);
    if (!quiz) throw new Error("Quiz not found");

    const questions = await this.getQuestions({ quizId: quiz.id });
    const submittedAnswers = db.submitted_answers.filter((sa) => sa.attempt_id === attemptId);

    let totalScore = 0;
    let correctCount = 0;

    for (const q of questions) {
      const userAns = submittedAnswers.find((sa) => sa.question_id === q.id);
      if (userAns && userAns.selected_option_id) {
        const correctOpt = db.answer_options.find((opt) => opt.question_id === q.id && opt.is_correct);
        if (correctOpt && userAns.selected_option_id === correctOpt.id) {
          userAns.is_correct = true;
          userAns.marks_awarded = Number(q.marks);
          totalScore += Number(q.marks);
          correctCount++;
        } else {
          userAns.is_correct = false;
          const penalty = Number(q.negative_marks || quiz.negative_marking_per_wrong || 0);
          userAns.marks_awarded = -penalty;
          totalScore -= penalty;
        }
      }
    }

    const finalScore = Math.max(0, Math.round(totalScore * 100) / 100);
    const percentage = quiz.total_marks > 0 ? Math.round((finalScore / quiz.total_marks) * 10000) / 100 : 0;
    const passed = percentage >= quiz.passing_percentage;

    attempt.status = "completed";
    attempt.completed_at = new Date().toISOString();
    attempt.score = finalScore;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.time_taken_seconds = timeTakenSeconds;
    attempt.last_active_at = new Date().toISOString();

    // Reward XP & Update Profile Streak
    const userProfile = db.profiles.find((p) => p.id === attempt.user_id);
    if (userProfile) {
      const earnedXp = Math.round(finalScore * 10) + (passed ? 50 : 20);
      userProfile.total_xp += earnedXp;

      // Check first quiz achievement
      const hasFirstQuiz = db.user_achievements.find(
        (ua) => ua.user_id === userProfile.id && ua.achievement_id === "ach-1"
      );
      if (!hasFirstQuiz) {
        db.user_achievements.push({
          id: `ua-${Date.now()}`,
          user_id: userProfile.id,
          achievement_id: "ach-1",
          unlocked_at: new Date().toISOString(),
        });
      }

      // Check centurion achievement (100% score)
      if (percentage >= 100) {
        const hasCenturion = db.user_achievements.find(
          (ua) => ua.user_id === userProfile.id && ua.achievement_id === "ach-2"
        );
        if (!hasCenturion) {
          db.user_achievements.push({
            id: `ua-cen-${Date.now()}`,
            user_id: userProfile.id,
            achievement_id: "ach-2",
            unlocked_at: new Date().toISOString(),
          });
          userProfile.total_xp += 200;
        }
      }
    }

    this.save();
    return (await this.getQuizAttempt(attemptId))!;
  }

  async getUserAttempts(userId: string): Promise<QuizAttempt[]> {
    const db = this.load();
    const attempts = db.quiz_attempts
      .filter((a) => a.user_id === userId && a.status === "completed")
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return attempts.map((a) => ({
      ...a,
      quiz: db.quizzes.find((q) => q.id === a.quiz_id),
    }));
  }

  // --- Bookmarks ---
  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const db = this.load();
    const userBookmarks = db.bookmarks.filter((b) => b.user_id === userId);
    return userBookmarks.map((b) => ({
      ...b,
      question: db.questions.find((q) => q.id === b.question_id),
    }));
  }

  async toggleBookmark(userId: string, questionId: string): Promise<{ bookmarked: boolean }> {
    const db = this.load();
    const idx = db.bookmarks.findIndex((b) => b.user_id === userId && b.question_id === questionId);
    if (idx >= 0) {
      db.bookmarks.splice(idx, 1);
      this.save();
      return { bookmarked: false };
    } else {
      db.bookmarks.push({
        id: `bm-${Date.now()}`,
        user_id: userId,
        question_id: questionId,
        created_at: new Date().toISOString(),
      });
      this.save();
      return { bookmarked: true };
    }
  }

  // --- Daily Challenges & Question of the Day ---
  async getDailyQuestionOfTheDay(): Promise<Question | null> {
    const db = this.load();
    const qotd = db.questions.find((q) => q.id === "q-qotd-1") || db.questions[0];
    if (!qotd) return null;
    return this.getQuestionById(qotd.id);
  }

  // --- Leaderboard ---
  async getLeaderboard(categoryId?: string): Promise<{
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl: string;
    totalXp: number;
    streakDays: number;
    quizzesCompleted: number;
    accuracy: number;
  }[]> {
    const db = this.load();

    const statsByUser: Record<string, { completed: number; totalScore: number; maxScore: number }> = {};

    db.quiz_attempts
      .filter((a) => a.status === "completed")
      .forEach((a) => {
        if (categoryId) {
          const q = db.quizzes.find((quiz) => quiz.id === a.quiz_id);
          if (!q || q.category_id !== categoryId) return;
        }

        if (!statsByUser[a.user_id]) {
          statsByUser[a.user_id] = { completed: 0, totalScore: 0, maxScore: 0 };
        }
        statsByUser[a.user_id].completed += 1;
        statsByUser[a.user_id].totalScore += a.score;
        statsByUser[a.user_id].maxScore += a.total_marks;
      });

    const entries = db.profiles
      .map((p) => {
        const stats = statsByUser[p.id] || { completed: 0, totalScore: 0, maxScore: 0 };
        const accuracy = stats.maxScore > 0 ? Math.round((stats.totalScore / stats.maxScore) * 100) : 0;
        return {
          userId: p.id,
          displayName: p.display_name,
          avatarUrl: p.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.id}`,
          totalXp: p.total_xp,
          streakDays: p.streak_days,
          quizzesCompleted: stats.completed,
          accuracy,
        };
      })
      .sort((a, b) => b.totalXp - a.totalXp || b.quizzesCompleted - a.quizzesCompleted);

    return entries.map((entry, index) => ({
      rank: index + 1,
      ...entry,
    }));
  }

  // --- OTP Verification Storage ---
  async saveOtp(mobile: string, otpHash: string, expiresAt: Date): Promise<void> {
    const db = this.load();
    const clean = mobile.replace(/\s+/g, "");
    db.otp_verifications = db.otp_verifications.filter((o) => o.mobile !== clean);
    db.otp_verifications.push({
      id: `otp-${Date.now()}`,
      mobile: clean,
      otp_hash: otpHash,
      expires_at: expiresAt.toISOString(),
      verified: false,
      attempts: 0,
      created_at: new Date().toISOString(),
    });
    this.save();
  }

  async verifyOtpHash(mobile: string, verifyFn: (hash: string) => boolean): Promise<{ success: boolean; message?: string }> {
    const db = this.load();
    const clean = mobile.replace(/\s+/g, "");
    const record = db.otp_verifications.find((o) => o.mobile === clean);
    if (!record) {
      return { success: false, message: "No OTP was requested for this mobile number" };
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return { success: false, message: "OTP has expired. Please request a new code." };
    }

    if (record.attempts >= 5) {
      return { success: false, message: "Maximum verification attempts exceeded. Please request a new OTP." };
    }

    record.attempts += 1;

    if (!verifyFn(record.otp_hash)) {
      this.save();
      return { success: false, message: "Invalid OTP. Please check and try again." };
    }

    record.verified = true;
    this.save();
    return { success: true };
  }

  // --- Scheduled Job Logs & Audit ---
  async logJob(jobName: string, status: "started" | "success" | "failed", imported = 0, skipped = 0, details = {}, error = ""): Promise<ScheduledJobLog> {
    const db = this.load();
    const log: ScheduledJobLog = {
      id: `job-${Date.now()}`,
      job_name: jobName,
      status,
      questions_imported: imported,
      questions_skipped: skipped,
      details,
      error_message: error,
      started_at: new Date().toISOString(),
      finished_at: status !== "started" ? new Date().toISOString() : undefined,
    };
    db.scheduled_job_logs.unshift(log);
    this.save();
    return log;
  }

  async getScheduledJobLogs(): Promise<ScheduledJobLog[]> {
    const db = this.load();
    return db.scheduled_job_logs.slice(0, 50);
  }

  async logAdminAudit(adminId: string, action: string, targetType: string, targetId = "", payload = {}): Promise<void> {
    const db = this.load();
    db.admin_audit_logs.unshift({
      id: `audit-${Date.now()}`,
      admin_id: adminId,
      action,
      target_type: targetType,
      target_id: targetId,
      payload,
      created_at: new Date().toISOString(),
    });
    this.save();
  }

  // --- Platform Stats ---
  async getPlatformStats() {
    const db = this.load();
    const totalQuestions = db.questions.filter((q) => q.is_published && q.review_status === "approved").length;
    const totalUsers = db.profiles.length;
    const totalAttempts = db.quiz_attempts.filter((a) => a.status === "completed").length;
    const totalQuizzes = db.quizzes.filter((q) => q.is_published).length;

    let avgScore = 0;
    if (totalAttempts > 0) {
      const sum = db.quiz_attempts
        .filter((a) => a.status === "completed")
        .reduce((acc, curr) => acc + curr.percentage, 0);
      avgScore = Math.round(sum / totalAttempts);
    }

    return {
      totalQuestions,
      totalUsers,
      totalAttempts,
      totalQuizzes,
      avgScore,
      pendingQuestions: db.questions.filter((q) => q.review_status === "pending").length,
    };
  }
}

export const db = new DatabaseStore();
