'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';

function getAI() {
  return new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
}

export default function LabsPage() {
  const [labs, setLabs] = useState<string[]>([]);
  const [newLab, setNewLab] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load labs from localStorage
  useEffect(() => {
    const savedLabs = localStorage.getItem('ccna-labs');
    if (savedLabs) {
      setLabs(JSON.parse(savedLabs));
    }
  }, []);

  // Save labs to localStorage
  useEffect(() => {
    localStorage.setItem('ccna-labs', JSON.stringify(labs));
  }, [labs]);

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLab.trim() !== '') {
      setLabs(prev => [...prev, newLab.trim()]);
      setNewLab('');
    }
  };

  const handleRemoveLab = (indexToRemove: number) => {
    setLabs(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const suggestNextLab = async () => {
    setIsLoading(true);
    setSuggestion('');
    const completedLabs = labs.join(', ');
    try {
      const prompt = `Based on the following list of completed CCNA labs, suggest a logical next lab to practice. Provide a brief reason for the suggestion. The completed labs are: ${completedLabs}. If the list is empty, suggest a good starting lab.`;
      const response = await getAI().models.generateContent({ model: 'gemini-3.1-pro-preview', contents: prompt });
      setSuggestion(response.text ?? 'Could not generate a suggestion.');
    } catch (error) {
      console.error('Error suggesting next lab:', error);
      setSuggestion('Sorry, an error occurred while generating a suggestion.');
    }
    setIsLoading(false);
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Labs Tracker</h1>
        <p className="text-slate-600 mb-8">Log the practical exercises and labs you&apos;ve completed.</p>

        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Need an Idea?</h2>
            <button onClick={suggestNextLab} disabled={isLoading} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 disabled:opacity-50">
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Thinking...' : 'Suggest Next Lab'}
            </button>
          </div>
          {suggestion && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="prose prose-sm max-w-none"><ReactMarkdown>{suggestion}</ReactMarkdown></div>
            </div>
          )}
        </div>

        <form onSubmit={handleAddLab} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newLab}
            onChange={(e) => setNewLab(e.target.value)}
            placeholder="e.g., Configure and verify OSPF"
            className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button type="submit" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="w-5 h-5" />
          </button>
        </form>

        <div className="space-y-3">
          {labs.length > 0 ? (
            labs.map((lab, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <p className="text-slate-800 font-medium">{lab}</p>
                <button onClick={() => handleRemoveLab(index)} className="text-slate-400 hover:text-red-600">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-10">No labs logged yet. Add your first one!</p>
          )}
        </div>
      </div>
    </Container>
  );
}
