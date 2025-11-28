import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, Tooltip, Bar, LabelList } from 'recharts';
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
        <BarChart data={categories} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number) => value?.toFixed(1)}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar dataKey="avgScore" fill="#6366f1" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="avgScore" position="top" formatter={(value: number) => value?.toFixed(1)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

