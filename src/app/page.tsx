import Container from '@/components/Container';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <Container className="text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
          Welcome to Your CCNA Journey
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          A simple, fast, and distraction-free learning tracker to help you master the CCNA.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/dashboard/1" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm">
            Start Today (Day 1)
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
          <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 shadow-sm">
            View Progress
          </Link>
        </div>
        <p className="mt-10 text-sm text-slate-500">
          Consistency is the key to mastery. Let&apos;s build it, one day at a time.
        </p>
      </div>
    </Container>
  );
}
