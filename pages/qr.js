export default function QRPage() {
  const url = 'https://dj-wunschbox.vercel.app';
  const qrUrl =
    'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' +
    encodeURIComponent(url);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0b0b0b',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: 24
    }}>
      <div style={{
        maxWidth: 520,
        width: '100%',
        background: '#151515',
        border: '1px solid #333',
        borderRadius: 24,
        padding: 32,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          background: '#1DB954',
          color: '#061b0d',
          padding: '8px 18px',
          borderRadius: 999,
          fontWeight: 'bold',
          marginBottom: 20
        }}>
          DJ Dennis
        </div>

        <h1 style={{ fontSize: 46, margin: '10px 0' }}>
          Wunschbox
        </h1>

        <p style={{ fontSize: 20, color: '#ccc', lineHeight: 1.5 }}>
          Scanne den QR-Code und sende deinen Musikwunsch direkt an DJ Dennis.
        </p>

        <div style={{
          background: 'white',
          padding: 20,
          borderRadius: 20,
          margin: '30px auto',
          width: 'fit-content'
        }}>
          <img
            src={qrUrl}
            alt="QR-Code zur DJ Dennis Wunschbox"
            width="300"
            height="300"
          />
        </div>

        <p style={{ fontSize: 18, color: '#aaa' }}>
          {url}
        </p>

        <button
          onClick={() => window.print()}
          style={{
            marginTop: 24,
            width: '100%',
            padding: 18,
            borderRadius: 14,
            border: 'none',
            background: '#1DB954',
            color: '#051b0b',
            fontSize: 20,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          QR-Code drucken
        </button>
      </div>
    </div>
  );
}
