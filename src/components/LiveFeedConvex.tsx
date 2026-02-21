'use client';

import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import type { Task } from '../types';
import ConvexWrapper from './ConvexWrapper';

function getDifficultyLabel(d: string) {
  if (d === 'beginner') return 'Lagano';
  if (d === 'intermediate') return 'Srednje';
  return 'Teško';
}
function getDifficultyColor(d: string) {
  if (d === 'beginner') return { bg: '#d1fae5', color: '#065f46' };
  if (d === 'intermediate') return { bg: '#fef3c7', color: '#92400e' };
  return { bg: '#fee2e2', color: '#991b1b' };
}

function LiveFeedContent() {
  const rawTasks = useQuery(api.tasks.getTasks);
  const tasks = rawTasks?.map(t => ({
    ...t,
    id: t._id.toString(),
    generatedAt: new Date(t.generatedAt).toISOString()
  })) as unknown as Task[];

  const dataLoading = rawTasks === undefined;

  if (dataLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 12 }}>
        <div style={{
          width: 28, height: 28, border: '3px solid #e5e7eb', borderTopColor: '#4f6ef7',
          borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <span style={{ color: '#9ca3af', fontWeight: 600, fontSize: 13 }}>Učitavanje zadataka...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#9ca3af', fontSize: 14, fontWeight: 500 }}>
        📭 Nema zadataka u bazi. Uskoro dolaze novi!
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="feed-grid">
        {tasks.slice(0, 3).map((task: Task) => {
          const dc = getDifficultyColor(task.difficulty);
          return (
            <a
              key={task.id}
              href={`/modul/${task.id}`}
              style={{
                background: '#fafaf8',
                border: '1.5px solid #e8e8e4',
                borderRadius: 14, padding: '18px 18px 14px',
                textDecoration: 'none', color: 'inherit',
                transition: 'all .18s', display: 'block',
              }}
              className="feed-card"
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{task.icon}</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: dc.bg, color: dc.color, textTransform: 'uppercase', letterSpacing: '.04em'
                }}>
                  {getDifficultyLabel(task.difficulty)}
                </span>
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1e1e1e', marginBottom: 6, lineHeight: 1.35 }}>
                {task.title}
              </h3>
              <p style={{ fontSize: 12.5, color: '#6b7280', fontWeight: 500, lineHeight: 1.5, marginBottom: 10 }}>
                {task.scenario?.slice(0, 100)}{(task.scenario?.length || 0) > 100 ? '...' : ''}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 500 }}>
                  {task.category || 'Zadatak'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#4f6ef7' }}>
                  Isprobaj →
                </span>
              </div>
            </a>
          );
        })}
      </div>
      <style>{`
        .feed-card:hover { border-color: rgba(79,110,247,.3) !important; transform: translateY(-2px); box-shadow: 0 4px 14px rgba(79,110,247,.08); }
        @media (max-width: 768px) { .feed-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

export default function LiveFeedConvex() {
  return (
    <ConvexWrapper>
      <LiveFeedContent />
    </ConvexWrapper>
  );
}
