import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Tooltip, Bar } from 'recharts';
import type { CategoryBreakdown } from '../api/types';

interface Props {
  categories: CategoryBreakdown[];
}

export function CategoryBreakdown({ categories }: Props) {
  if (!categories.length) {
    return <p style={{ color: '#94a3b8' }}>No graded calls in this range.</p>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={categories}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => value?.toFixed(1)}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

