'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/components/Container';
import Link from 'next/link';

interface DayData {
  topic?: string;
  notes?: string;
}

export default function DayPage() {
  const params = useParams();
  const day = Number(params.day);

  const [data, setData] = useState<DayData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(`ccna-day-${day}`);

    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {}
    }
  }, [day]);

  return (
    <Container>
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="text-blue-600 text-sm">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-3">Day {day}</h1>

        {data ? (
          <>
            <h2 className="text-xl font-semibold mb-2">{data.topic}</h2>
            {data.notes && (
              <p className="whitespace-pre-wrap text-slate-700">
                {data.notes}
              </p>
            )}
          </>
        ) : (
          <p className="text-slate-500">No data saved for this day yet.</p>
        )}
      </div>
    </Container>
  );
}