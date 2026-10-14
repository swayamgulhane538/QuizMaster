-- ====================================================================
-- QuizMaster PostgreSQL Row Level Security (RLS)
-- Migration 002: RLS Policies & Security
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answer_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE submitted_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN profiles p ON p.id = ur.user_id
        WHERE p.auth_id = auth.uid()::text AND ur.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth_id = auth.uid()::text);

-- 2. User Roles Policies
CREATE POLICY "Roles viewable by self or admin" 
ON user_roles FOR SELECT 
USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text)
    OR is_admin()
);

-- 3. Exam Categories, Subjects, Topics
CREATE POLICY "Categories viewable by everyone" ON exam_categories FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "Subjects viewable by everyone" ON exam_subjects FOR SELECT USING (true);
CREATE POLICY "Topics viewable by everyone" ON topics FOR SELECT USING (true);

-- Admin can manage catalog
CREATE POLICY "Admin manage categories" ON exam_categories FOR ALL USING (is_admin());
CREATE POLICY "Admin manage subjects" ON exam_subjects FOR ALL USING (is_admin());
CREATE POLICY "Admin manage topics" ON topics FOR ALL USING (is_admin());

-- 4. Quizzes Policies
CREATE POLICY "Published quizzes viewable by everyone" 
ON quizzes FOR SELECT 
USING (is_published = true OR is_admin());

CREATE POLICY "Admins can manage quizzes" 
ON quizzes FOR ALL 
USING (is_admin());

-- 5. Questions Policies
CREATE POLICY "Approved published questions viewable by authenticated users" 
ON questions FOR SELECT 
USING (review_status = 'approved' AND is_published = true OR is_admin());

CREATE POLICY "Admins can manage questions" 
ON questions FOR ALL 
USING (is_admin());

-- 6. Answer Options Policies
CREATE POLICY "Answer options viewable for quizzes" 
ON answer_options FOR SELECT 
USING (true);

-- 7. Quiz Attempts Policies
CREATE POLICY "Users view own quiz attempts" 
ON quiz_attempts FOR SELECT 
USING (user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text) OR is_admin());

CREATE POLICY "Users insert own quiz attempts" 
ON quiz_attempts FOR INSERT 
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text));

CREATE POLICY "Users update own quiz attempts" 
ON quiz_attempts FOR UPDATE 
USING (user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text));

-- 8. Submitted Answers Policies
CREATE POLICY "Users view own submitted answers" 
ON submitted_answers FOR SELECT 
USING (
    attempt_id IN (
        SELECT id FROM quiz_attempts 
        WHERE user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text)
    ) OR is_admin()
);

CREATE POLICY "Users manage own submitted answers" 
ON submitted_answers FOR ALL 
USING (
    attempt_id IN (
        SELECT id FROM quiz_attempts 
        WHERE user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text)
    )
);

-- 9. Bookmarks Policies
CREATE POLICY "Users manage own bookmarks" 
ON bookmarks FOR ALL 
USING (user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid()::text));

-- 10. Achievements & Challenges
CREATE POLICY "Achievements viewable by all" ON achievements FOR SELECT USING (true);
CREATE POLICY "Daily challenges viewable by all" ON daily_challenges FOR SELECT USING (true);
CREATE POLICY "User achievements viewable by all" ON user_achievements FOR SELECT USING (true);

-- 11. Scheduled Logs & Audit (Admin Only)
CREATE POLICY "Job logs viewable by admin" ON scheduled_job_logs FOR ALL USING (is_admin());
CREATE POLICY "Audit logs viewable by admin" ON admin_audit_logs FOR ALL USING (is_admin());
