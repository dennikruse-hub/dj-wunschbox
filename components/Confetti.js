export default function Confetti() {
  const colors = ['#1db954', '#35ff75', '#ffffff', '#ffd23f', '#ff4d8d', '#00e5ff'];
  const pieces = Array.from({ length: 45 });

  return (
    <>
      <style jsx global>{`
        @keyframes confettiFall {
          0% { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <div style={styles.confettiWrap}>
        {pieces.map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.confettiPiece,
              left: `${(i * 23) % 100}%`,
              background: colors[i % colors.length],
              animationDelay: `${(i % 10) * 0.08}s`,
              animationDuration: `${1.8 + (i % 5) * 0.25}s`
            }}
          />
        ))}
      </div>
    </>
  );
}

const styles = {
  confettiWrap: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 99,
    overflow: 'hidden'
  },
  confettiPiece: {
    position: 'absolute',
    top: -30,
    width: 10,
    height: 18,
    borderRadius: 4,
    animationName: 'confettiFall',
    animationTimingFunction: 'linear',
    animationFillMode: 'forwards'
  }
};
