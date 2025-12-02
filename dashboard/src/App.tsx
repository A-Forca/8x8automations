import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAgents, fetchAgentInsights, fetchAgentMetrics } from './api/client';
import type { AgentInsight, AgentListItem, AgentMetricsResponse } from './api/types';
import { AgentGrid } from './components/AgentGrid';
import { AgentDetail } from './components/AgentDetail';
import { InsightsPanel } from './components/InsightsPanel';
import { SpreadsheetView } from './components/SpreadsheetView';

const RANGE_OPTIONS = [7, 30, 60];

function useSelectedAgentId(agents: { id: string }[] | undefined) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  useEffect(() => {
    if (!agents || agents.length === 0) {
      setSelectedAgentId(null);
      return;
    }
    if (!selectedAgentId || !agents.some((agent) => agent.id === selectedAgentId)) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  return [selectedAgentId, setSelectedAgentId] as const;
}

export default function App() {
  const [rangeDays, setRangeDays] = useState(30);
  const [showSpreadsheet, setShowSpreadsheet] = useState(false);
  const queryClient = useQueryClient();
  const agentsQuery = useQuery<AgentListItem[]>({
    queryKey: ['agents', rangeDays],
    queryFn: () => fetchAgents(rangeDays),
    staleTime: 10 * 60_000,
    gcTime: 20 * 60_000,
    placeholderData: (prev: AgentListItem[] | undefined) => prev ?? undefined,
  });

  const [selectedAgentId, setSelectedAgentId] = useSelectedAgentId(agentsQuery.data);

  const metricsQuery = useQuery<AgentMetricsResponse>({
    queryKey: ['agent-metrics', selectedAgentId, rangeDays],
    queryFn: () => fetchAgentMetrics(selectedAgentId!, rangeDays),
    enabled: Boolean(selectedAgentId),
    staleTime: 10 * 60_000,
    gcTime: 20 * 60_000,
    placeholderData: (prev: AgentMetricsResponse | undefined) => prev ?? undefined,
  });

  const insightsQuery = useQuery<AgentInsight[]>({
    queryKey: ['agent-insights', selectedAgentId, rangeDays],
    queryFn: () => fetchAgentInsights(selectedAgentId!, { limit: 3, windowDays: rangeDays }),
    enabled: Boolean(selectedAgentId),
    staleTime: 10 * 60_000,
    gcTime: 20 * 60_000,
    placeholderData: (prev: AgentInsight[] | undefined) => prev ?? undefined,
  });

  // Prefetch the other ranges in the background to make toggling instant.
  useEffect(() => {
    const otherRanges = RANGE_OPTIONS.filter((r) => r !== rangeDays);
    if (!agentsQuery.data) return;
    otherRanges.forEach((r) => {
      queryClient.prefetchQuery({
        queryKey: ['agents', r],
        queryFn: () => fetchAgents(r),
        staleTime: 10 * 60_000,
        gcTime: 20 * 60_000,
      });
      if (selectedAgentId) {
        queryClient.prefetchQuery({
          queryKey: ['agent-metrics', selectedAgentId, r],
          queryFn: () => fetchAgentMetrics(selectedAgentId, r),
          staleTime: 10 * 60_000,
          gcTime: 20 * 60_000,
        });
        queryClient.prefetchQuery({
          queryKey: ['agent-insights', selectedAgentId, r],
          queryFn: () => fetchAgentInsights(selectedAgentId, { limit: 3, windowDays: r }),
          staleTime: 10 * 60_000,
          gcTime: 20 * 60_000,
        });
      }
    });
  }, [agentsQuery.data, rangeDays, selectedAgentId, queryClient]);

  const insightsContent = useMemo(() => {
    if (insightsQuery.isLoading) return <p style={{ color: '#94a3b8' }}>Loading...</p>;
    if (insightsQuery.error)
      return (
        <p style={{ color: '#ef4444' }}>
          Failed to load insights: {(insightsQuery.error as Error).message}
        </p>
      );
    return <InsightsPanel insights={insightsQuery.data || []} />;
  }, [insightsQuery.data, insightsQuery.error, insightsQuery.isLoading]);

  if (agentsQuery.error) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#ef4444' }}>
          Failed to load agents: {(agentsQuery.error as Error).message}
        </p>
      </div>
    );
  }

  const agents = agentsQuery.data || [];

  return (
    <div className="app-shell">
      <AgentGrid
        agents={agents}
        selectedAgentId={selectedAgentId}
        onSelect={(id) => setSelectedAgentId(id)}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0 }}>Performance Window</h2>
              <div className="range-toggle">
                {RANGE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={rangeDays === option ? 'active' : ''}
                    onClick={() => setRangeDays(option)}
                  >
                    {option}d
                  </button>
                ))}
                {agentsQuery.isFetching && (
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Refreshing…</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSpreadsheet((prev) => !prev)}
              style={{
                border: '1px solid #cbd5f5',
                background: showSpreadsheet ? '#4f46e5' : '#fff',
                color: showSpreadsheet ? '#fff' : '#1e293b',
                borderRadius: '999px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
              }}
            >
              {showSpreadsheet ? 'Back to Insights' : 'Spreadsheet View'}
            </button>
          </div>
          <p style={{ marginBottom: 0, color: '#64748b' }}>
            Compare call volume, QA scores, time on call, and insights for the selected window.
          </p>
        </div>
        {showSpreadsheet ? (
          <SpreadsheetView />
        ) : (
          <AgentDetail metrics={metricsQuery.data} insights={insightsContent} />
        )}
      </div>
    </div>
  );
}
