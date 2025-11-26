export interface AgentSummary {
  rangeStart: string;
  rangeEnd: string;
  rangeDays: number;
  avgScoreRange: number | null;
  avgScore30d: number | null;
  avgScore7d: number | null;
  avgScore1d: number | null;
  totalCalls: number;
  avgCallsPerDay: number;
  avgCallSeconds: number | null;
  avgCallMinutes: number | null;
  totalCallSeconds: number;
  totalCallMinutes: number;
}

export interface AgentTimeSeriesPoint {
  date: string;
  callCount: number;
  avgScore: number | null;
  avgCallSeconds: number | null;
}

export interface CategoryBreakdown {
  slug: string;
  label: string;
  avgScore: number | null;
  maxScore: number;
}

export interface AgentListItem {
  id: string;
  fullName: string;
  profilePhotoUrl?: string | null;
  totalCalls: number;
  avgScore: number | null;
  avgCallSeconds: number | null;
  avgCallMinutes: number | null;
  avgCallsPerDay: number;
  totalCallMinutes: number;
  rangeStart: string;
  rangeEnd: string;
  rangeDays: number;
}

export interface AgentMetricsResponse {
  agent: {
    id: string;
    fullName: string;
    profilePhotoUrl?: string | null;
  };
  range: {
    start: string;
    end: string;
    days: number;
  };
  summary: AgentSummary;
  charts: {
    dailyCalls: { date: string; callCount: number }[];
    dailyScores: { date: string; avgScore: number | null }[];
    dailyHandleTime: { date: string; avgCallSeconds: number | null }[];
  };
  categories: CategoryBreakdown[];
}

export interface AgentInsight {
  id: number;
  fromDate: string;
  toDate: string;
  summary: string | null;
  strengths: string[];
  weaknesses: string[];
  actionItems: string[];
  generatedAt: string;
}

export interface AgentCall {
  id: string;
  agentId?: string;
  agentName?: string | null;
  callTimestamp: string;
  durationSeconds: number | null;
  customerPhone: string | null;
  recordingUrl: string | null;
  transcription?: string;
  summary: string | null;
  gradeSynopsis: string | null;
  qaTotalScore: number | null;
  qaMaxScore: number | null;
}

