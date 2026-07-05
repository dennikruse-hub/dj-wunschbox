export default function InputCard({ icon, label, optional, children }) {
  return (
    <label style={styles.field}>
      <div style={styles.iconCircle}>{icon}</div>
      <div style={styles.fieldContent}>
        <div style={styles.label}>
          {label} {optional && <span style={styles.optional}>(optional)</span>}
        </div>
        {children}
      </div>
    </label>
  );
}

const styles = {
  field: {
    display: 'flex',
    gap: 14,
    background: 'rgba(255,255,255,.035)',
    border: '1px solid rgba(29,185,84,.35)',
    borderRadius: 18,
    padding: 14
  },
  iconCircle: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 999,
    background: 'rgba(29,185,84,.18)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    boxShadow: '0 0 18px rgba(29,185,84,.25)'
  },
  fieldContent: { flex: 1, display: 'grid', gap: 8 },
  label: { fontWeight: 900 },
  optional: { color: '#aaa', fontWeight: 500 }
};
