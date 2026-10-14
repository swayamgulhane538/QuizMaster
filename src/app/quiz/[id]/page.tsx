import React from "react";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { QuizEngine } from "@/components/quiz/quiz-engine";

export const dynamic = "force-dynamic";

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quiz = await db.getQuizById(id);

  if (!quiz) {
    notFound();
  }

  const user = await getCurrentUser();
  const userId = user?.id || "guest-user-default";

  // Start or restore attempt
  const attempt = await db.startQuizAttempt(userId, quiz.id);

  // If already completed, redirect to results
  if (attempt.status === "completed") {
    redirect(`/quiz/${quiz.id}/result/${attempt.id}`);
  }

  // Load questions with correct answers hidden
  const questions = await db.getQuestions({
    quizId: quiz.id,
    hideCorrectAnswers: true,
    reviewStatus: "approved",
    isPublished: true,
  });

  return (
    <QuizEngine
      quiz={quiz}
      questions={questions}
      initialAttempt={attempt}
    />
  );
}
