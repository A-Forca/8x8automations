import dayjs from 'dayjs';
import type { AgentCall } from '../api/types';

interface CallListProps {
  calls: AgentCall[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

function formatDuration(seconds: number | null | undefined) {
  if (!seconds || seconds <= 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
}

export function CallList({ calls, isLoading, error }: CallListProps) {
  if (isLoading) {
    return <p style={{ color: '#94a3b8' }}>Loading calls…</p>;
  }
  if (error) {
    return <p style={{ color: '#ef4444' }}>Failed to load calls: {error.message}</p>;
  }
  if (!calls || calls.length === 0) {
    return <p style={{ color: '#94a3b8' }}>No calls in this window.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {calls.map((call) => (
        <details
          key={call.id}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            background: '#f8fafc',
          }}
        >
          <summary
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              gap: '1rem',
            }}
          >
            <div>
              <strong style={{ color: '#0f172a' }}>
                {dayjs(call.callTimestamp).format('MMM D, HH:mm')}
              </strong>
              <div style={{ color: '#475569', fontSize: '0.85rem' }}>
                {call.customerPhone || 'Unknown'} · {formatDuration(call.durationSeconds)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#0f172a', fontWeight: 600 }}>
                {call.qaTotalScore !== null
                  ? `${call.qaTotalScore}/${call.qaMaxScore ?? 12}`
                  : 'Unscored'}
              </div>
              {call.recordingUrl ? (
                <a
                  href={call.recordingUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.85rem', color: '#2563eb' }}
                >
                  Recording →
                </a>
              ) : null}
            </div>
          </summary>
          <div style={{ marginTop: '0.75rem', color: '#0f172a', fontSize: '0.95rem' }}>
            {call.gradeSynopsis ? (
              <p style={{ marginTop: 0 }}>
                <strong>Grade:</strong> {call.gradeSynopsis}
              </p>
            ) : null}
            {call.summary ? (
              <p>
                <strong>Summary:</strong> {call.summary}
              </p>
            ) : null}
            {call.transcription ? (
              <details style={{ marginTop: '0.5rem' }}>
                <summary style={{ cursor: 'pointer', color: '#2563eb' }}>View transcription</summary>
                <p style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem' }}>{call.transcription}</p>
              </details>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}

