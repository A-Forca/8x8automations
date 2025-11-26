import type { AgentListItem, AgentMetricsResponse, AgentInsight, AgentCall } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const SHARED_SECRET = import.meta.env.VITE_SHARED_SECRET || '';

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (SHARED_SECRET) {
    headers.set('x-shared-secret', SHARED_SECRET);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.error || `Request failed with ${response.status}`);
  }

  return response.json();
}

export async function fetchAgents(rangeDays: number): Promise<AgentListItem[]> {
  const params = new URLSearchParams({ rangeDays: String(rangeDays) });
  const data = await request<{ agents: AgentListItem[] }>(`/agents?${params.toString()}`);
  return data.agents;
}

export async function fetchAgentMetrics(
  agentId: string,
  rangeDays: number
): Promise<AgentMetricsResponse> {
  const params = new URLSearchParams({ rangeDays: String(rangeDays) });
  return request<AgentMetricsResponse>(`/agents/${agentId}/metrics?${params.toString()}`);
}

export async function fetchAgentInsights(
  agentId: string,
  limit = 3
): Promise<AgentInsight[]> {
  const params = new URLSearchParams({ limit: String(limit) });
  const data = await request<{ insights: AgentInsight[] }>(
    `/agents/${agentId}/insights?${params.toString()}`
  );
  return data.insights;
}

export async function fetchAgentCalls(
  agentId: string,
  options: { limit?: number; includeTranscript?: boolean } = {}
): Promise<AgentCall[]> {
  const params = new URLSearchParams({
    limit: String(options.limit ?? 50),
    includeTranscript: String(options.includeTranscript ?? true),
  });
  const data = await request<{ calls: AgentCall[] }>(
    `/agents/${agentId}/calls?${params.toString()}`
  );
  return data.calls;
}

export async function fetchAllCalls(options: {
  limit?: number;
  includeTranscript?: boolean;
} = {}): Promise<AgentCall[]> {
  const params = new URLSearchParams({
    limit: String(options.limit ?? 1000),
    includeTranscript: String(options.includeTranscript ?? false),
  });
  const data = await request<{ calls: AgentCall[] }>(`/calls?${params.toString()}`);
  return data.calls;
}

