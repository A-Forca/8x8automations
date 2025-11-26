import dayjs from 'dayjs';
import type { AgentInsight } from '../api/types';

interface Props {
  insights: AgentInsight[];
}

export function InsightsPanel({ insights }: Props) {
  if (!insights.length) {
    return <p style={{ color: '#94a3b8' }}>No insights generated yet.</p>;
  }
  return (
    <div className="insights-list">
      {insights.map((insight) => (
        <div key={insight.id} className="insight-card">
          <h4>
            {dayjs(insight.fromDate).format('MMM D')} – {dayjs(insight.toDate).format('MMM D')}
          </h4>
          {insight.summary ? <p style={{ marginTop: 0 }}>{insight.summary}</p> : null}
          {insight.strengths.length ? (
            <div>
              <strong>Strengths</strong>
              <div className="chip-row">
                {insight.strengths.map((item) => (
                  <span key={item} className="chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {insight.weaknesses.length ? (
            <div style={{ marginTop: '0.35rem' }}>
              <strong>Coaching</strong>
              <div className="chip-row">
                {insight.weaknesses.map((item) => (
                  <span key={item} className="chip" style={{ background: '#fee2e2', color: '#881337' }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          {insight.actionItems.length ? (
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem' }}>
              {insight.actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          <small style={{ color: '#94a3b8' }}>
            Updated {dayjs(insight.generatedAt).format('MMM D, h:mm a')}
          </small>
        </div>
      ))}
    </div>
  );
}

