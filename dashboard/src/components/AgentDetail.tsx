import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdown } from './CategoryBreakdown';
import { MetricCard } from './MetricCard';
import { CallList } from './CallList';
import { fetchAgentCalls } from '../api/client';
import type { AgentMetricsResponse, AgentCall } from '../api/types';
import { getProfilePhoto } from '../utils/profilePhoto';

interface AgentDetailProps {
  metrics: AgentMetricsResponse | undefined;
  insights: React.ReactNode;
}

export function AgentDetail({ metrics, insights }: AgentDetailProps) {
  if (!metrics) {
    return (
      <div className="panel" style={{ gridColumn: 'span 2' }}>
        <p style={{ color: '#94a3b8' }}>Select an agent to view insights.</p>
      </div>
    );
  }

  const { agent, summary, charts, categories } = metrics;
  const callsQuery = useQuery<AgentCall[]>({
    queryKey: ['agent-calls', agent.id],
    queryFn: () => fetchAgentCalls(agent.id, { limit: 50, includeTranscript: true }),
    enabled: Boolean(agent.id),
  });
  const callsError =
    callsQuery.error instanceof Error
      ? callsQuery.error
      : callsQuery.error
        ? new Error('Failed to load calls')
        : null;

  const formatScore = (value: number | null) =>
    value !== null && Number.isFinite(value) ? value.toFixed(1) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={
                getProfilePhoto(agent.fullName, agent.profilePhotoUrl) ||
                `https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=${encodeURIComponent(agent.fullName)}`
              }
              alt={agent.fullName}
              style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h2 style={{ marginBottom: 0 }}>{agent.fullName}</h2>
              <span style={{ color: '#94a3b8' }}>
                {summary.rangeStart} → {summary.rangeEnd}
              </span>
            </div>
          </div>
        </div>
        <div className="metric-cards" style={{ marginTop: '1rem' }}>
          <MetricCard label="Avg score (range)" value={formatScore(summary.avgScoreRange)} />
          <MetricCard label="Avg score (30d)" value={formatScore(summary.avgScore30d)} />
          <MetricCard label="Avg score (7d)" value={formatScore(summary.avgScore7d)} />
          <MetricCard label="Avg score (1d)" value={formatScore(summary.avgScore1d)} />
          <MetricCard label="Calls / day" value={summary.avgCallsPerDay.toFixed(1)} />
          <MetricCard
            label="Total mins"
            value={summary.totalCallMinutes.toFixed(1)}
            hint={`${summary.totalCalls} calls`}
          />
        </div>
      </div>

      <div className="panel">
        <h3>Daily Calls (last {summary.rangeDays}d)</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={charts.dailyCalls}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
              <YAxis width={40} />
              <Tooltip />
              <Line type="monotone" dataKey="callCount" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>QA Score Trend</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={charts.dailyScores}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
              <YAxis domain={[0, 12]} width={40} />
              <Tooltip formatter={(value: number) => value?.toFixed(1)} />
              <Line type="monotone" dataKey="avgScore" stroke="#6366f1" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>Category Breakdown</h3>
        <CategoryBreakdown categories={categories} />
      </div>

      <div className="panel">
        <h3>Actionable Insights</h3>
        {insights}
      </div>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Recent Calls</h3>
          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Showing latest {callsQuery.data?.length || 0}
          </span>
        </div>
        <CallList calls={callsQuery.data} isLoading={callsQuery.isLoading} error={callsError} />
      </div>
    </div>
  );
}
