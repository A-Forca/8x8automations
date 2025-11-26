import type { AgentListItem } from '../api/types';

interface AgentGridProps {
  agents: AgentListItem[];
  selectedAgentId: string | null;
  onSelect: (agentId: string) => void;
}

export function AgentGrid({ agents, selectedAgentId, onSelect }: AgentGridProps) {
  return (
    <div className="panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Agents</h2>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{agents.length} total</span>
      </div>
      <div className="agent-grid">
        {agents.map((agent) => (
          <button
            type="button"
            key={agent.id}
            className={`agent-card ${selectedAgentId === agent.id ? 'active' : ''}`}
            onClick={() => onSelect(agent.id)}
          >
            <img
              src={
                agent.profilePhotoUrl ||
                `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(agent.fullName)}`
              }
              alt={agent.fullName}
            />
            <div style={{ textAlign: 'left' }}>
              <strong style={{ display: 'block', color: '#0f172a' }}>{agent.fullName}</strong>
              <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                {agent.totalCalls} calls ·{' '}
                {agent.avgScore !== null ? `${agent.avgScore.toFixed(1)} QA` : 'No score'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

