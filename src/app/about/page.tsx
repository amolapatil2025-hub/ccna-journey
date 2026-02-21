import Container from '@/components/Container';
import { BookOpen, Sparkles, Target } from 'lucide-react';

export default function AboutPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">About CCNA Journey</h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A smart, minimalist tool for building consistency and mastery in your CCNA studies.
          </p>
        </div>

        <div className="mt-16 space-y-12 text-base leading-7 text-slate-700">
          <div className="prose prose-lg max-w-none">
            <h2>Purpose of the App</h2>
            <p>
              CCNA Journey is built on the principle that daily, focused effort is the most effective way to learn and retain complex technical information. It provides a distraction-free environment to log your progress, reflect on your learning, and identify areas for improvement.
            </p>

            <h2>Key Features</h2>
            <ul>
              <li><strong>Daily Tracking:</strong> Build a powerful habit of continuous learning by logging your topic, notes, and commands every day.</li>
              <li><strong>Understanding Levels:</strong> Rate your grasp of each topic to pinpoint areas that need more review.</li>
              <li><strong>Revision Queue:</strong> Get quick links to your most recently studied topics to reinforce your knowledge.</li>
              <li><strong>Labs Tracker:</strong> Keep a running list of the hands-on labs you&apos;ve completed.</li>
            </ul>

            <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI-Powered Learning Assistant
              </h3>
              <p className="mt-4 text-blue-800">
                To accelerate your learning, CCNA Journey is enhanced with Google&apos;s Gemini models. This provides you with an AI Coach that can:
              </p>
              <ul className="text-blue-800">
                <li>Analyze your study notes to provide key takeaways.</li>
                <li>Explain complex Cisco commands.</li>
                <li>Generate quick quizzes to test your knowledge.</li>
                <li>Suggest new labs based on your progress.</li>
                <li>Provide motivational insights on your dashboard.</li>
              </ul>
              <p className="mt-4 text-sm text-blue-700">
                <strong>Disclaimer:</strong> AI-generated content is for guidance and may contain inaccuracies. Always verify critical information with official Cisco documentation.
              </p>
            </div>

            <h2>A Message on Mastery</h2>
            <p>
              Mastering the CCNA curriculum is a marathon, not a sprint. This tool is your personal companion on that journey. Use it to stay focused, stay consistent, and achieve your goal.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}

