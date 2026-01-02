'use client';
import { useEffect } from 'react';
export default function Home() {
  useEffect(() => {
    window.location.href = '/assessment.html';
  }, []);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <p>Redirecting to assessment...</p>
    </div>
  );
}