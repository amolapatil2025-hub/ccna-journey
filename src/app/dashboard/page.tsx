'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import Link from 'next/link';
import { ArrowRight, Book, Target, TrendingUp, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import Welcome from '@/components/Welcome';

<<<<<<< HEAD
function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
}
=======
const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
>>>>>>> fe491e44639188f074fba6477f2f8cebb5a8a72d

interface StudyData {
  day: number;
  topic: string;
  understanding: number;
}

export default function DashboardPage() {
  const [daysCompleted, setDaysCompleted] = useState(0);
  const [averageUnderstanding, setAverageUnderstanding] = useState(0);
  const [topicsStudied, setTopicsStudied] = useState<StudyData[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const allData: StudyData[] = [];
    let totalUnderstanding = 0;
    for (let i = 1; i < 500; i++) {
      const savedData = localStorage.getItem(`ccna-day-${i}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.topic) {
          allData.push({ day: i, topic: data.topic, understanding: data.understanding });
          totalUnderstanding += data.understanding;
        }
      }
    }
    setTopicsStudied(allData);
    setDaysCompleted(allData.length);
    if (allData.length > 0) {
      setAverageUnderstanding(totalUnderstanding / allData.length);
    }
    setIsReady(true); // Data loaded, ready to render
  }, []);

  const getAiInsight = async () => {
    setIsLoading(true);
    setAiInsight('');
    const recentTopics = topicsStudied.slice(-5).map(t => `Day ${t.day}: ${t.topic} (Understanding: ${t.understanding}/5)`).join('\n');
    try {
      const prompt = `Act as a friendly and encouraging CCNA coach. Based on the following recent study data, provide a short (2-3 sentences) motivational insight. Highlight a recent success and suggest a small, actionable focus. The data is:\n${recentTopics}`;
      const response = await ai.models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
      setAiInsight(response.text ?? 'Could not generate insight.');
    } catch (error) {
      console.error('Error getting AI insight:', error);
      setAiInsight('An error occurred while getting your coaching insight.');
    }
    setIsLoading(false);
  };

  const totalDays = 100; // Example total days for CCNA prep
  const progress = (daysCompleted / totalDays) * 100;

  if (!isReady) {
    return <Container><div className="text-center py-20">Loading your progress...</div></Container>;
  }

  if (daysCompleted === 0) {
    return <Container><Welcome startDay={1} /></Container>;
  }

  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Progress</h1>
          <p className="text-slate-600 mt-1">Keep up the great work. Consistency is paying off!</p>
        </div>

        {/* AI Coach */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">AI Coach</h2>
            <button onClick={getAiInsight} disabled={isLoading || daysCompleted === 0} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Thinking...' : 'Get Insight'}
            </button>
          </div>
          {aiInsight && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="prose prose-sm max-w-none"><ReactMarkdown>{aiInsight}</ReactMarkdown></div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-medium text-slate-700">Overall Progress</h2>
            <span className="text-sm font-medium text-slate-700">{daysCompleted} / {totalDays} days</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{daysCompleted}</h3>
                <p className="text-sm text-slate-600">Days Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{averageUnderstanding.toFixed(1)} / 5</h3>
                <p className="text-sm text-slate-600">Avg. Understanding</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{topicsStudied.length}</h3>
                <p className="text-sm text-slate-600">Topics Studied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Studied */}
        <div>
          <h2 className="text-xl font-bold text-slate-900">Topics You&apos;ve Covered</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topicsStudied.map((topic, index) => (
              <span key={index} className="px-3 py-1 text-sm font-medium bg-slate-200 text-slate-700 rounded-full">
                {topic.topic}
              </span>
            ))}
          </div>
        </div>

        {/* Continue Learning CTA */}
        <div className="text-center pt-6">
          <Link href={`/dashboard/${daysCompleted + 1}`} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
            Continue to Day {daysCompleted + 1}
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>

      </div>
    </Container>
  );
}
