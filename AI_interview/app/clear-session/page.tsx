'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClearSession() {
  const router = useRouter();

  useEffect(() => {
    // Call the API route to clear the session
    fetch('/api/clear-session', { method: 'POST' })
      .then(() => {
        // Redirect to sign-in page after clearing session
        router.push('/sign-in');
      })
      .catch((error) => {
        console.error('Error clearing session:', error);
        router.push('/sign-in');
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Session...</h1>
        <p>Please wait while we clear your session.</p>
      </div>
    </div>
  );
}
