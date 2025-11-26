import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { fetchAllCalls } from '../api/client';
import type { AgentCall } from '../api/types';

export function SpreadsheetView() {
  const callsQuery = useQuery<AgentCall[]>({
    queryKey: ['all-calls'],
    queryFn: () => fetchAllCalls({ limit: 2000, includeTranscript: false }),
  });

  if (callsQuery.isLoading) {
    return (
      <div className="panel">
        <p style={{ color: '#94a3b8' }}>Loading spreadsheet…</p>
      </div>
    );
  }

  if (callsQuery.error) {
    return (
      <div className="panel">
        <p style={{ color: '#ef4444' }}>
          Failed to load spreadsheet: {(callsQuery.error as Error).message}
        </p>
      </div>
    );
  }

  const calls = callsQuery.data || [];

  return (
    <div className="panel" style={{ overflow: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h2>Spreadsheet View</h2>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{calls.length} rows</span>
      </div>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
          minWidth: '900px',
        }}
      >
        <thead>
          <tr>
            {[
              'Timestamp',
              'Agent',
              'Phone',
              'Duration',
              'Score',
              'Recording',
              'Summary',
              'Grade Notes',
            ].map((header) => (
              <th
                key={header}
                style={{
                  textAlign: 'left',
                  padding: '0.5rem',
                  borderBottom: '1px solid #e2e8f0',
                  background: '#f1f5f9',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '0.5rem' }}>
                {dayjs(call.callTimestamp).format('YYYY-MM-DD HH:mm')}
              </td>
              <td style={{ padding: '0.5rem' }}>{call.agentName || '—'}</td>
              <td style={{ padding: '0.5rem' }}>{call.customerPhone || '—'}</td>
              <td style={{ padding: '0.5rem' }}>
                {call.durationSeconds ? `${Math.round(call.durationSeconds / 60)}m` : '—'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {call.qaTotalScore !== null
                  ? `${call.qaTotalScore}/${call.qaMaxScore ?? 12}`
                  : '—'}
              </td>
              <td style={{ padding: '0.5rem' }}>
                {call.recordingUrl ? (
                  <a href={call.recordingUrl} target="_blank" rel="noreferrer">
                    Link
                  </a>
                ) : (
                  '—'
                )}
              </td>
              <td style={{ padding: '0.5rem', maxWidth: '320px' }}>{call.summary || '—'}</td>
              <td style={{ padding: '0.5rem', maxWidth: '320px' }}>
                {call.gradeSynopsis || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

