'use client';

import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import Link from 'next/link';

interface StudyData {
  day: number;
  topic: string;
}

export default function DashboardPage() {
  const [days, setDays] = useState<StudyData[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const entries: StudyData[] = [];

    for (let i = 1; i <= 500; i++) {
      const saved = localStorage.getItem(`ccna-day-${i}`);

      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data?.topic) {
            entries.push({ day: i, topic: data.topic });
          }
        } catch {}
      }
    }

    setDays(entries.reverse());
  }, []);

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-slate-600 mb-8">
          Track your CCNA study journey.
        </p>

        <Link
          href="/dashboard/1"
          className="inline-block mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Start Your First Day
        </Link>

        <div className="space-y-4">
          {days.length > 0 ? (
            days.map(({ day, topic }) => (
              <Link
                key={day}
                href={`/dashboard/${day}`}
                className="block p-4 border rounded-lg hover:bg-slate-50"
              >
                <span className="text-sm text-slate-500">Day {day}</span>
                <h2 className="font-bold">{topic}</h2>
              </Link>
            ))
          ) : (
            <p className="text-slate-500">
              No study days logged yet.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}