import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function ToastContainer() {
  const toasts = useStore(s => s.toasts);
  const removeToast = useStore(s => s.removeToast);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(t => {
        const Icon = t.type === 'success' ? CheckCircle2
          : t.type === 'error' ? AlertCircle
          : t.type === 'warning' ? AlertTriangle
          : Info;

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">
              <Icon size={15} />
            </span>
            <span className="toast-msg">{t.msg}</span>
            <button
              type="button"
              className="toast-dismiss-btn"
              onClick={() => removeToast(t.id)}
              title="Dismiss notification"
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
