'use client';

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
          )}
        </div>
      </div>
    </Container>
  );
}