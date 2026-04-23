/**
 * NotificationBell
 *
 * Accepts pre-fetched data from useNotifications() so the parent (Home)
 * can share the same data source with the inline list — no double fetch.
 *
 * Props:
 *   notifications  — array from useNotifications
 *   unreadCount    — number from useNotifications
 *   markOne(id)    — function from useNotifications
 *   markAll()      — function from useNotifications
 *   refresh()      — function from useNotifications
 *   style          — optional extra style for the wrapper
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCircle, Clock, XCircle, AlertCircle,
  FileText, X, CheckCheck
} from 'lucide-react';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getNotifMeta(notification) {
  const type    = notification?.type    || 'SIGNALEMENT';
  const message = notification?.message || '';

  if (type === 'RECLAMATION') {
    if (message.includes('clôturée'))   return { icon: <CheckCircle size={15} color="#10B981" />, bg: '#f0fdf4', label: 'Réclamation', color: '#059669' };
    if (message.includes('traitement')) return { icon: <Clock       size={15} color="#F59E0B" />, bg: '#fffbeb', label: 'Réclamation', color: '#D97706' };
    if (message.includes('acceptée'))   return { icon: <CheckCircle size={15} color="#10B981" />, bg: '#f0fdf4', label: 'Réclamation', color: '#059669' };
    if (message.includes('examen'))     return { icon: <Clock       size={15} color="#F59E0B" />, bg: '#fffbeb', label: 'Réclamation', color: '#D97706' };
    return                                     { icon: <FileText    size={15} color="#0056D2" />, bg: '#EFF6FF', label: 'Réclamation', color: '#0056D2' };
  }

  // SIGNALEMENT (default)
  if (message.includes('résolu'))      return { icon: <CheckCircle size={15} color="#10B981" />, bg: '#f0fdf4', label: 'Signalement', color: '#059669' };
  if (message.includes('traitement'))  return { icon: <Clock       size={15} color="#F59E0B" />, bg: '#fffbeb', label: 'Signalement', color: '#D97706' };
  if (message.includes('cours'))       return { icon: <Clock       size={15} color="#F59E0B" />, bg: '#fffbeb', label: 'Signalement', color: '#D97706' };
  if (message.includes('rejeté'))      return { icon: <XCircle     size={15} color="#6B7280" />, bg: '#f8fafc', label: 'Signalement', color: '#6B7280' };
  return                                     { icon: <AlertCircle size={15} color="#E70011" />, bg: '#fef2f2', label: 'Signalement', color: '#E70011' };
}

export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'À l\'instant';
  if (m < 60) return `Il y a ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `Il y a ${h}h`;
  return `Il y a ${Math.floor(h / 24)}j`;
}

// ── Component ─────────────────────────────────────────────────────────────────
const NotificationBell = ({
  notifications = [],
  unreadCount   = 0,
  markOne,
  markAll,
  refresh,
  style = {},
}) => {
  const navigate  = useNavigate();
  const [open, setOpen] = useState(false);
  const panelRef  = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = () => {
    setOpen(prev => !prev);
    if (!open && refresh) refresh();
  };

  /** Mark as read + navigate */
  const handleItemClick = async (n) => {
    if (n.statut === 'NON_LU' && markOne) await markOne(n.id);
    setOpen(false);
    
    // Navigate based on notification type
    if (n.type === 'RECLAMATION') {
      navigate('/reclamation-list');
    } else if (n.type === 'SIGNALEMENT') {
      navigate('/signalement-list');
    } else {
      // Default navigation for other types
      navigate('/home');
    }
  };

  return (
    <div style={{ position: 'relative', ...style }} ref={panelRef}>

      {/* Bell button */}
      <button onClick={toggle} style={S.bellBtn} aria-label="Notifications">
        <Bell size={20} color="white" />
        {unreadCount > 0 && (
          <span style={S.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={S.panel} className="notif-panel-enter">

          {/* Header */}
          <div style={S.panelHeader}>
            <div>
              <p style={S.panelTitle}>Notifications</p>
              {unreadCount > 0 && (
                <p style={S.panelSub}>{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button onClick={markAll} style={S.markAllBtn} title="Tout marquer comme lu">
                  <CheckCheck size={14} />
                </button>
              )}
              <button onClick={() => setOpen(false)} style={S.closeBtn}>
                <X size={14} color="#94a3b8" />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={S.list}>
            {notifications.length === 0 ? (
              <div style={S.empty}>
                <Bell size={28} color="#CBD5E1" />
                <p style={S.emptyText}>Aucune notification</p>
              </div>
            ) : (
              notifications.map(n => {
                const meta = getNotifMeta(n);
                return (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    style={{
                      ...S.item,
                      background:  n.statut === 'NON_LU' ? '#f8faff' : 'white',
                      borderLeft:  n.statut === 'NON_LU' ? `3px solid ${meta.color}` : '3px solid transparent',
                    }}
                  >
                    <div style={{ ...S.itemIcon, background: meta.bg }}>{meta.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ ...S.typeBadge, color: meta.color, background: meta.bg }}>
                        {meta.label}
                      </span>
                      <p style={S.itemMsg}>{n.message}</p>
                      <p style={S.itemTime}>{timeAgo(n.dateCreation)}</p>
                    </div>
                    {n.statut === 'NON_LU' && <div style={{ ...S.dot, background: meta.color }} />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  bellBtn: {
    width: '38px', height: '38px',
    background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', position: 'relative',
  },
  badge: {
    position: 'absolute', top: '-5px', right: '-5px',
    background: '#E70011', color: 'white',
    fontSize: '9px', fontWeight: '900',
    minWidth: '16px', height: '16px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '0 3px', border: '2px solid #0056D2',
  },
  panel: {
    position: 'absolute', top: '46px', right: 0,
    width: '310px', background: 'white',
    borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
    border: '1px solid #E2E8F0', zIndex: 500, overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9',
  },
  panelTitle: { margin: 0, fontSize: '0.9rem', fontWeight: '900', color: '#1e293b' },
  panelSub:   { margin: '2px 0 0', fontSize: '0.7rem', color: '#94a3b8', fontWeight: '600' },
  markAllBtn: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: '#EFF6FF', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0056D2',
  },
  closeBtn: {
    width: '28px', height: '28px', borderRadius: '8px',
    background: '#F8FAFC', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  list: { maxHeight: '340px', overflowY: 'auto', scrollbarWidth: 'none' },
  empty: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '32px 16px', gap: '10px',
  },
  emptyText: { color: '#94a3b8', fontSize: '0.82rem', fontWeight: '600', margin: 0 },
  item: {
    display: 'flex', alignItems: 'flex-start', gap: '10px',
    padding: '11px 14px 11px 12px',
    borderBottom: '1px solid #F8FAFC',
    cursor: 'pointer', transition: 'background 0.15s',
  },
  itemIcon: {
    width: '32px', height: '32px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  typeBadge: {
    display: 'inline-block', fontSize: '0.58rem', fontWeight: '900',
    textTransform: 'uppercase', letterSpacing: '0.5px',
    padding: '2px 6px', borderRadius: '6px', marginBottom: '3px',
  },
  itemMsg:  { margin: 0, fontSize: '0.78rem', fontWeight: '700', color: '#1e293b', lineHeight: '1.4' },
  itemTime: { margin: '3px 0 0', fontSize: '0.65rem', color: '#94a3b8', fontWeight: '600' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px' },
};

export default NotificationBell;
