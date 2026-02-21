'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import Link from 'next/link';

/* ✅ Type definition added */
interface DaySummary {
  day: number;
  topic: string;
  notes?: string;
}

export default function WeeklyPage() {
  const [weekData, setWeekData] = useState<DaySummary[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const summaries: DaySummary[] = [];

    // collect last 7 days of study
    for (let i = 1; i <= 500; i++) {
      const savedData = localStorage.getItem(`ccna-day-${i}`);

      if (savedData) {
        try {
          const data = JSON.parse(savedData);

          if (data?.topic) {
            summaries.push({
              day: i,
              topic: data.topic,
              notes: data.notes ?? '',
            });
          }
        } catch {
          console.warn('Invalid JSON for day', i);
        }
      }
    }

    // take last 7 entries
    const lastSeven = summaries.slice(-7).reverse();
    setWeekData(lastSeven);
  }, []);

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Weekly Review
        </h1>
        <p className="text-slate-600 mb-8">
          A quick look at what you studied over the last week.
        </p>

        <div className="space-y-4">
          {weekData.length > 0 ? (
            weekData.map(({ day, topic, notes }) => (
              <div
                key={day}
                className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
              >
                <Link href={`/dashboard/${day}`}>
                  <span className="text-sm text-slate-500">
                    Day {day}
                  </span>
                  <h2 className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                    {topic}
                  </h2>
                </Link>

                {notes && (
                  <p className="text-sm text-slate-600 mt-2">
                    {notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-10">
              No study activity found yet.
            </p>
=======
import { useState, useEffect, useCallback } from 'react';
import Container from '@/components/Container';
import { Clipboard, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

interface DaySummary {
  day: number;
  topic: string;
  understanding: number;
}

export default function WeeklySummaryPage() {
  const [summaries, setSummaries] = useState<DaySummary[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let lastDay = 0;
    for (let i = 1; i < 500; i++) { // Check up to 500 days to find the last entry
      if (localStorage.getItem(`ccna-day-${i}`)) {
        lastDay = i;
      }
    }

    const weeklySummaries: DaySummary[] = [];
    for (let i = lastDay; i > 0 && weeklySummaries.length < 7; i--) {
      const savedData = localStorage.getItem(`ccna-day-${i}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.topic) {
          weeklySummaries.push({ day: i, topic: data.topic, understanding: data.understanding });
        }
      }
    }
    setSummaries(weeklySummaries.reverse());
  }, []);

  const generateAiSummary = async () => {
    setIsLoading(true);
    setAiSummary('');
    const weeklyData = summaries.map(s => `Day ${s.day}: ${s.topic} (Understanding: ${s.understanding}/5)`).join('\n');
    try {
      const prompt = `As an expert CCNA instructor, analyze the following weekly study log. Provide a brief, encouraging summary of the student's progress. Identify potential strengths (topics with high understanding) and areas for review (topics with lower understanding). Finally, suggest a focus for the upcoming week. Format the output as markdown.\n\nStudy Log:\n${weeklyData}`;
      const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
      setAiSummary(response.text ?? 'Could not generate summary.');
    } catch (error) {
      console.error('Error generating AI summary:', error);
      setAiSummary('Sorry, an error occurred while generating the summary.');
    }
    setIsLoading(false);
  };

  const copyWeeklySummary = useCallback(() => {
    let summaryText = "This week's CCNA Journey progress:\n\n";
    summaries.forEach(s => {
      summaryText += `Day ${s.day}: ${s.topic} (Understanding: ${s.understanding}/5)\n`;
    });
    summaryText += "\n#CCNA #Networking #Cisco #LearningJourney";
    navigator.clipboard.writeText(summaryText);
    alert('Weekly summary copied to clipboard!');
  }, [summaries]);

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Weekly Summary</h1>
            <p className="text-slate-600">A look at your last 7 days of study.</p>
          </div>
          <button onClick={copyWeeklySummary} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
            <Clipboard className="w-4 h-4" />
            Copy for Sharing
          </button>
        </div>

        {aiSummary && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Insights</h2>
            <div className="prose prose-sm max-w-none"><ReactMarkdown>{aiSummary}</ReactMarkdown></div>
          </div>
        )}

        <div className="space-y-3 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-800">Your Study Log</h2>
            <button onClick={generateAiSummary} disabled={isLoading || summaries.length === 0} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Generating...' : 'Generate AI Summary'}
            </button>
          </div>
          {summaries.length > 0 ? (
            summaries.map(summary => (
              <div key={summary.day} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-b-0">
                <div>
                  <span className="text-sm text-slate-500">Day {summary.day}</span>
                  <p className="font-medium text-slate-800">{summary.topic}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div key={level} className={`w-4 h-4 rounded-full ${summary.understanding >= level ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-10">Not enough data for a weekly summary yet.</p>
>>>>>>> fe491e44639188f074fba6477f2f8cebb5a8a72d
          )}
        </div>
      </div>
    </Container>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> fe491e44639188f074fba6477f2f8cebb5a8a72d
