export default function AdminRedirect() {
  if (typeof window !== 'undefined') {
    window.location.href = '/dj';
  }

  return (
    <main style={{ background: '#02030a', color: 'white', minHeight: '100vh', padding: 30 }}>
      Lade DJ Control Center...
    </main>
  );
}
