-- ====================================================================
-- QuizMaster Seed Data
-- Migration 003: Core Categories, Quizzes, Questions & Achievements
-- ====================================================================

-- Insert Achievements
INSERT INTO achievements (id, code, title, description, badge_icon, xp_reward) VALUES
('a0000000-0000-0000-0000-000000000001', 'FIRST_STEP', 'First Step', 'Completed your first quiz on QuizMaster', 'Sparkles', 50),
('a0000000-0000-0000-0000-000000000002', 'PERFECT_SCORE', 'Centurion', 'Scored 100% on a full-length mock test', 'Award', 200),
('a0000000-0000-0000-0000-000000000003', 'STREAK_7', '7-Day Warrior', 'Maintained a daily practice streak for 7 consecutive days', 'Flame', 150),
('a0000000-0000-0000-0000-000000000004', 'UPSC_SCHOLAR', 'Civil Servant', 'Completed 5 UPSC Civil Services mock tests', 'GraduationCap', 100),
('a0000000-0000-0000-0000-000000000005', 'SPEED_DEMON', 'Speed Demon', 'Completed a timed quiz in under 5 minutes with >= 80% accuracy', 'Zap', 120),
('a0000000-0000-0000-0000-000000000006', 'TECH_WIZARD', 'Algorithm Master', 'Scored top marks in Computer Science & DSA mock tests', 'Cpu', 100)
ON CONFLICT (code) DO NOTHING;
