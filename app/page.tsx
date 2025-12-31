export default function Home() {
  if (typeof window !== 'undefined') {
    window.location.href = '/assessment.html';
  }
  return null;
}
