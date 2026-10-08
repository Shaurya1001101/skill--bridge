import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', gap: 16 }}>
      <div style={{ fontFamily: 'Outfit', fontSize: 80, fontWeight: 900, color: 'var(--border)', lineHeight: 1 }}>404</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>Page not found</div>
      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>The page you're looking for doesn't exist in SkillBridge.</div>
      <button className="btn btn-primary" onClick={() => navigate('/')}>← Back to Dashboard</button>
    </div>
  );
}
