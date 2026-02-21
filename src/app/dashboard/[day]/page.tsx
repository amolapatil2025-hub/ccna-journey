'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/Container';
import { ArrowLeft, ArrowRight, Clipboard, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

// IMPORTANT: Add your Gemini API key to .env.local
/* ✅ Safe Gemini initializer */
function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
}
interface DailyData {
  topic: string;
  learning: string;
  commands: string;
  insight: string;
  understanding: number;
}

export default function DailyEntryPage() {
  const params = useParams();
  const router = useRouter();
  const day = parseInt(params.day as string, 10);

  const [data, setData] = useState<DailyData>({
    topic: '',
    learning: '',
    commands: '',
    insight: '',
    understanding: 3,
  });

  const [learningAnalysis, setLearningAnalysis] = useState('');
  const [commandsExplanation, setCommandsExplanation] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingCommands, setIsLoadingCommands] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUnderstandingChange = (level: number) => {
    setData(prev => ({ ...prev, understanding: level }));
  };

  // Load data from localStorage
  useEffect(() => {
    if (isNaN(day)) return;
    const savedData = localStorage.getItem(`ccna-day-${day}`);
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, [day]);

  // Auto-save data to localStorage
  useEffect(() => {
    if (isNaN(day)) return;
    const handler = setTimeout(() => {
      localStorage.setItem(`ccna-day-${day}`, JSON.stringify(data));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [data, day]);

  const analyzeLearningNotes = async () => {
    if (!data.learning) return;
    setIsLoadingAnalysis(true);
    setLearningAnalysis('');
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Based on the following CCNA study notes, generate a few key takeaways and suggest one related topic to study next. Format the output as markdown:\n\n${data.learning}`,
      });
      setLearningAnalysis(response.text ?? '');
    } catch (error) {
      console.error('Error analyzing learning notes:', error);
      setLearningAnalysis("Sorry, I couldn't analyze the notes right now.");
    }
    setIsLoadingAnalysis(false);
  };

  const explainCommands = async () => {
    if (!data.commands) return;
    setIsLoadingCommands(true);
    setCommandsExplanation('');
    try {
      const response = await getAI().models.generateContent({
        model: 'gemini-flash-latest',
        contents: `Explain the following Cisco IOS commands, assuming a CCNA-level context. Provide a brief explanation for each command. Format the output as a markdown list:\n\n${data.commands}`,
      });
      setCommandsExplanation(response.text ?? '');
    } catch (error) {
      console.error('Error explaining commands:', error);
      setCommandsExplanation("Sorry, I couldn't explain the commands right now.");
    }
    setIsLoadingCommands(false);
  };

  const copySummary = useCallback(() => {
    const summary = `CCNA Day ${day} Summary:\n\nTopic: ${data.topic}\n\nLearned: ${data.learning}\n\nCommands: ${data.commands}\n\nInsight: ${data.insight}\n\nUnderstanding: ${data.understanding}/5`;
    navigator.clipboard.writeText(summary);
    alert('Summary copied to clipboard!');
  }, [data, day]);

  if (isNaN(day)) {
    return <Container><p>Invalid day number.</p></Container>;
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* ... Navigation remains the same ... */}

        <div className="space-y-6 bg-white p-8 rounded-lg shadow-sm border border-slate-200">
          <InputField label="Topic Studied" name="topic" value={data.topic} onChange={handleInputChange} placeholder="e.g., OSPF Configuration" />
          
          <div>
            <TextAreaField label="What did you learn today?" name="learning" value={data.learning} onChange={handleInputChange} placeholder="Describe the key concepts, protocols, and configurations you studied." />
            <div className="text-right mt-2">
              <button onClick={analyzeLearningNotes} disabled={isLoadingAnalysis || !data.learning} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                {isLoadingAnalysis ? 'Analyzing...' : 'Analyze with Gemini'}
              </button>
            </div>
            {isLoadingAnalysis && <div className="mt-4 text-sm text-slate-500">Generating insights...</div>}
            {learningAnalysis && <div className="mt-4 p-4 bg-slate-50 rounded-md"><div className="prose prose-sm max-w-none"><ReactMarkdown>{learningAnalysis}</ReactMarkdown></div></div>}
          </div>

          <div>
            <TextAreaField label="Commands Practiced" name="commands" value={data.commands} onChange={handleInputChange} placeholder="List the commands you practiced, e.g., 'router ospf 1', 'network 192.168.1.0 0.0.0.255 area 0'" />
            <div className="text-right mt-2">
              <button onClick={explainCommands} disabled={isLoadingCommands || !data.commands} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
                <Sparkles className="w-4 h-4" />
                {isLoadingCommands ? 'Explaining...' : 'Explain with Gemini'}
              </button>
            </div>
            {isLoadingCommands && <div className="mt-4 text-sm text-slate-500">Generating explanations...</div>}
            {commandsExplanation && <div className="mt-4 p-4 bg-slate-50 rounded-md"><div className="prose prose-sm max-w-none"><ReactMarkdown>{commandsExplanation}</ReactMarkdown></div></div>}
          </div>

          <TextAreaField label="Key Insight" name="insight" value={data.insight} onChange={handleInputChange} placeholder="Explain a concept in your own words. What was your 'aha!' moment?" />
          
          {/* ... Understanding Level and Copy Summary remain the same ... */}
        </div>
      </div>
    </Container>
  );
}

// Reusable form components
const InputField = ({ label, name, value, onChange, placeholder }: { label: string, name: string, value: string, onChange: any, placeholder: string }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder }: { label: string, name: string, value: string, onChange: any, placeholder: string }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
);
