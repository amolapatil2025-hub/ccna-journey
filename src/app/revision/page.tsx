'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import Link from 'next/link';

interface RevisionTopic {
  day: number;
  topic: string;
}

export default function RevisionPage() {
  const [topics, setTopics] = useState<RevisionTopic[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastDay = 0;

    for (let i = 1; i < 500; i++) {
      if (localStorage.getItem(`ccna-day-${i}`)) lastDay = i;
    }

    const revisionTopics: RevisionTopic[] = [];

    for (let i = lastDay; i > 0 && revisionTopics.length < 10; i--) {
      const saved = localStorage.getItem(`ccna-day-${i}`);

      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data?.topic) {
            revisionTopics.push({ day: i, topic: data.topic });
          }
        } catch {}
      }
    }

    setTopics(revisionTopics.reverse());
  }, []);

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Revision Queue</h1>
        <p className="text-slate-600 mb-8">
          Revisit recent topics for better retention.
        </p>

        <div className="space-y-4">
          {topics.length > 0 ? (
            topics.map(({ day, topic }) => (
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
            <p className="text-center text-slate-500 py-10">
              No topics to revise yet.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}