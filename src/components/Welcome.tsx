import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Welcome({ startDay }: { startDay: number }) {
  return (
    <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900">Welcome to Your CCNA Journey</h2>
      <p className="mt-4 text-slate-600 max-w-prose mx-auto">
        This tool is designed to help you build consistency and mastery in your CCNA studies. Log your progress daily, track your understanding, and use the AI-powered features to accelerate your learning.
      </p>
      <div className="mt-8">
        <Link href={`/dashboard/${startDay}`} className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
          Start Your First Day
          <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
