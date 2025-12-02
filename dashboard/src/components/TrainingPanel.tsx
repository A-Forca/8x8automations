import type { CategoryBreakdown } from '../api/types';

interface TrainingItem {
  slug: string;
  label: string;
  description: string;
  tips: string[];
  avgScore?: number | null;
}

const TRAINING_LIBRARY: Record<string, Omit<TrainingItem, 'slug' | 'avgScore'>> = {
  greeting: {
    label: 'Greeting / Identity',
    description: 'Open confidently, state who you are and why you’re calling, and make it easy for the customer to trust you.',
    tips: [
      'Answer quickly with your name + company and a warm tone.',
      'Confirm who you’re speaking with and the reason for the call in one sentence.',
      'Smile while speaking; it naturally improves tone and pacing.',
    ],
  },
  empathy: {
    label: 'Empathy / Tone',
    description: 'Show you understand the customer’s situation and make them feel heard before troubleshooting.',
    tips: [
      'Acknowledge the impact (“I can see why that’s frustrating”).',
      'Match their pace and energy; avoid sounding rushed or scripted.',
      'Use short affirmations while they explain (“got it”, “I’m with you”).',
    ],
  },
  listening: {
    label: 'Listening / Clarity',
    description: 'Gather the right facts without making the customer repeat themselves.',
    tips: [
      'Ask one question at a time; avoid stacking multiple asks.',
      'Paraphrase back the issue to confirm understanding.',
      'Take brief notes so you don’t need to ask for repeats.',
    ],
  },
  resolution: {
    label: 'Resolution',
    description: 'Provide a clear, confidence-building solution and own the next steps.',
    tips: [
      'Explain what you’re doing while you work (“I’m checking X now”).',
      'Offer the simplest fix first; avoid jargon unless needed.',
      'Set expectations if you need to investigate or escalate.',
    ],
  },
  verification: {
    label: 'Verification / Summary',
    description: 'Confirm the solution works and the customer knows what happens next.',
    tips: [
      'Recap the fix in one or two sentences.',
      'Check that the customer can repeat the steps on their own.',
      'Restate any follow-up timing or references they might need.',
    ],
  },
  closing: {
    label: 'Closing',
    description: 'End on a positive note and leave the customer confident.',
    tips: [
      'Ask if there’s anything else you can help with.',
      'Thank them for their time and patience.',
      'Offer one proactive tip or resource when appropriate.',
    ],
  },
};

const DEFAULT_ORDER = ['greeting', 'empathy', 'listening', 'resolution', 'verification', 'closing'];

interface Props {
  categories: CategoryBreakdown[];
}

export function TrainingPanel({ categories }: Props) {
  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  const ordered: TrainingItem[] = DEFAULT_ORDER.map((slug) => {
    const library = TRAINING_LIBRARY[slug];
    const category = categoryMap.get(slug);
    return {
      slug,
      label: category?.label || library?.label || slug,
      description: library?.description || 'How we assess this part of the conversation.',
      tips: library?.tips || ['Keep this concise and helpful.'],
      avgScore: category?.avgScore ?? null,
    };
  });

  const extras: TrainingItem[] = categories
    .filter((c) => !DEFAULT_ORDER.includes(c.slug))
    .map((category) => ({
      slug: category.slug,
      label: category.label,
      description: 'How we assess this part of the conversation.',
      tips: ['Stay clear, concise, and focused on the customer outcome.'],
      avgScore: category.avgScore,
    }));

  const items = [...ordered, ...extras];

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {items.map((item) => (
        <div
          key={item.slug}
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: '#0f172a' }}>{item.label}</h4>
            {item.avgScore !== undefined && item.avgScore !== null ? (
              <span style={{ color: '#475569', fontSize: '0.85rem' }}>
                Avg score: {item.avgScore.toFixed(1)}
              </span>
            ) : null}
          </div>
          <p style={{ margin: '0.35rem 0', color: '#475569' }}>{item.description}</p>
          <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem', color: '#0f172a' }}>
            {item.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
