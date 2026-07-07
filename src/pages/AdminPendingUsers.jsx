import { useState, useEffect, useCallback } from 'react';
import { Icon } from '../components/icons';
import { Card, Button, Avatar, Badge, Modal, Input, Field } from '../components/ui';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function fmtDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  return isNaN(date) ? '—' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function AdminPendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [adminCode, setAdminCode] = useState(() => sessionStorage.getItem('adminCode') || '');
  const [codeInput, setCodeInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const needsCode = !adminCode;

  const fetchPending = useCallback(async (code) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/admin/pending-users`, {
        headers: { 'x-admin-code': code || adminCode }
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setAdminCode('');
          sessionStorage.removeItem('adminCode');
          setError('Código de admin incorrecto. Ingresa la contraseña nuevamente.');
          return;
        }
        throw new Error(`Error ${res.status}`);
      }
      const data = await res.json();
      setPendingUsers(data);
    } catch (err) {
      setError('No se pudo cargar la lista: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [adminCode]);

  useEffect(() => {
    if (!needsCode) fetchPending();
  }, [needsCode, fetchPending]);

  const verifyCode = async () => {
    if (!codeInput.trim()) return;
    setVerifying(true);
    setCodeError('');
    try {
      const res = await fetch(`${API}/api/admin/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput.trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Código incorrecto');
      setAdminCode(codeInput.trim());
      sessionStorage.setItem('adminCode', codeInput.trim());
      fetchPending(codeInput.trim());
    } catch (err) {
      setCodeError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAction = async (userId, action) => {
    setActionLoading(userId + action);
    try {
      const res = await fetch(`${API}/api/admin/approve-user/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-code': adminCode },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      showToast(data.message);
      setPendingUsers(prev => prev.filter(u => (u._id || u.id) !== userId));
    } catch (err) {
      showToast('❌ Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Code gate
  if (needsCode) {
    return (
      <div className="fade-up" style={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <Card style={{ maxWidth: 420, width: '100%', padding: 36, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
            <Icon.Settings size={28} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Admin — Contraseña requerida</h2>
          <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>Ingresa la contraseña de administrador para ver las solicitudes pendientes.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {codeError && <div style={{ fontSize: 13, color: 'var(--error, #c00)', background: 'var(--error-soft, #fee)', padding: '8px 12px', borderRadius: 8 }}>{codeError}</div>}
            <Input
              type="password"
              placeholder="Contraseña admin"
              value={codeInput}
              onChange={e => setCodeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyCode()}
            />
            <Button onClick={verifyCode} disabled={verifying} style={{ width: '100%' }}>
              {verifying ? 'Verificando...' : 'Continuar'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
            ⏳ Pending Approvals ({pendingUsers.length})
          </h2>
          <p className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            Nuevos usuarios esperando aprobación para entrar al sistema.
          </p>
        </div>
        <Button variant="outline" icon={Icon.Refresh} onClick={() => fetchPending()}>
          Actualizar
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--error-soft, #fee)', color: 'var(--error, #c00)', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ display: 'grid', placeItems: 'center', padding: 60 }}>
          <div className="muted" style={{ fontSize: 14 }}>Cargando solicitudes...</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && pendingUsers.length === 0 && (
        <Card style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>✅</div>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>No hay solicitudes pendientes</h3>
          <p className="muted" style={{ fontSize: 13, marginTop: 6 }}>Todos los usuarios han sido revisados.</p>
        </Card>
      )}

      {/* User cards */}
      {!loading && pendingUsers.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--gap)' }}>
          {pendingUsers.map(user => {
            const uid = user._id || user.id;
            const approving = actionLoading === uid + 'approve';
            const rejecting = actionLoading === uid + 'reject';
            return (
              <Card key={uid} style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <Avatar name={user.name} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    <div className="muted" style={{ fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    <div style={{ marginTop: 4 }}>
                      <Badge tone="neutral" style={{ fontSize: 11 }}>{user.role}</Badge>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 16 }}>
                  Registrado: {fmtDate(user.createdAt)}
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleAction(uid, 'approve')}
                    disabled={approving || rejecting}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                      background: approving ? '#aaa' : '#28a745', color: '#fff',
                      fontWeight: 600, fontSize: 13.5, cursor: approving || rejecting ? 'not-allowed' : 'pointer',
                      transition: 'opacity .15s', opacity: approving || rejecting ? 0.7 : 1
                    }}
                  >
                    {approving ? '...' : '✅ Approve'}
                  </button>
                  <button
                    onClick={() => handleAction(uid, 'reject')}
                    disabled={approving || rejecting}
                    style={{
                      flex: 1, padding: '9px', borderRadius: 9, border: 'none',
                      background: rejecting ? '#aaa' : '#dc3545', color: '#fff',
                      fontWeight: 600, fontSize: 13.5, cursor: approving || rejecting ? 'not-allowed' : 'pointer',
                      transition: 'opacity .15s', opacity: approving || rejecting ? 0.7 : 1
                    }}
                  >
                    {rejecting ? '...' : '❌ Reject'}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '12px 22px', fontSize: 14, fontWeight: 600,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 9999, whiteSpace: 'nowrap'
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}
