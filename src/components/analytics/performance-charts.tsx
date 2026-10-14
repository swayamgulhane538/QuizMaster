"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface PerformanceChartsProps {
  scoreHistory: { date: string; score: number; percentage: number; title: string }[];
  categoryAccuracy: { name: string; accuracy: number }[];
}

export function PerformanceCharts({ scoreHistory, categoryAccuracy }: PerformanceChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* 1. Score Progression Trend */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Score Progression Trend (%)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tracking your percentage improvement across recent test attempts
          </p>
        </div>

        <div className="h-64 w-full">
          {scoreHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreHistory}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value}%`, "Score"]}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No test attempts recorded yet. Start practicing to generate trends!
            </div>
          )}
        </div>
      </div>

      {/* 2. Category Accuracy Breakdown */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="mb-6">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Accuracy by Exam Category (%)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comparative strength breakdown across target examinations
          </p>
        </div>

        <div className="h-64 w-full">
          {categoryAccuracy.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryAccuracy}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                  formatter={(value: any) => [`${value}%`, "Accuracy"]}
                />
                <Bar dataKey="accuracy" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              Attempt mock tests to calculate your subject accuracy breakdown!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
