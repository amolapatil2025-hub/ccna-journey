'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import Link from 'next/link';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Sparkles } from 'lucide-react';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });

interface RevisionTopic {
  day: number;
  topic: string;
}

export default function RevisionPage() {
  const [topics, setTopics] = useState<RevisionTopic[]>([]);
  const [quizzes, setQuizzes] = useState<Record<number, string>>({});
  const [loadingQuiz, setLoadingQuiz] = useState<number | null>(null);

  useEffect(() => {
    let lastDay = 0;
    for (let i = 1; i < 500; i++) { // Check up to 500 days to find the last entry
      if (localStorage.getItem(`ccna-day-${i}`)) {
        lastDay = i;
      }
    }

    const revisionTopics: RevisionTopic[] = [];
    for (let i = lastDay; i > 0 && revisionTopics.length < 10; i--) {
      const savedData = localStorage.getItem(`ccna-day-${i}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.topic) {
          revisionTopics.push({ day: i, topic: data.topic });
        }
      }
    }
    setTopics(revisionTopics.reverse());
  }, []);

  const generateQuiz = async (day: number, topic: string) => {
    if (quizzes[day]) {
      setQuizzes(prev => ({ ...prev, [day]: '' })); // Hide if already generated
      return;
    }
    setLoadingQuiz(day);
    try {
      const prompt = `Generate a short, 2-question multiple-choice quiz about the CCNA topic: "${topic}". Provide the questions, options, and then the correct answer with a brief explanation. Format the output as markdown.`;
      const response = await ai.models.generateContent({ model: 'gemini-flash-latest', contents: prompt });
      setQuizzes(prev => ({ ...prev, [day]: response.text ?? 'Could not generate quiz.' }));
    } catch (error) {
      console.error('Error generating quiz:', error);
      setQuizzes(prev => ({ ...prev, [day]: 'Sorry, an error occurred while generating the quiz.' }));
    }
    setLoadingQuiz(null);
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Revision Queue</h1>
        <p className="text-slate-600 mb-8">Revisit your recent topics and test your knowledge with a quick quiz.</p>
        
        <div className="space-y-4">
          {topics.length > 0 ? (
            topics.map(({ day, topic }) => (
              <div key={day} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <Link href={`/dashboard/${day}`} className="flex-grow">
                    <span className="text-sm text-slate-500">Day {day}</span>
                    <h2 className="font-bold text-slate-800 hover:text-blue-600 transition-colors">{topic}</h2>
                  </Link>
                  <button onClick={() => generateQuiz(day, topic)} disabled={loadingQuiz === day} className="ml-4 flex-shrink-0 inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
                    <Sparkles className="w-4 h-4" />
                    {loadingQuiz === day ? 'Generating...' : (quizzes[day] ? 'Hide Quiz' : 'Generate Quiz')}
                  </button>
                </div>
                {quizzes[day] && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="prose prose-sm max-w-none"><ReactMarkdown>{quizzes[day]}</ReactMarkdown></div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-10">No topics studied yet. Start your first day!</p>
          )}
        </div>
      </div>
    </Container>
  );
}
