'use client';

import { ConvexProvider } from 'convex/react';
import { convex } from '../lib/convexClient';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import type { Task } from '../types';
import TaskCard from './ui/TaskCard';

function LiveFeedContent() {
  const tasks = useQuery(api.tasks.getTasks);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');

  const isLoading = tasks === undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Učitavanje zadataka iz Convex baze... 🔄</span>
      </div>
    );
  }

  const handleTryTask = (taskId: string) => {
    setActiveTask(taskId);
    const task = tasks?.find((t: Task) => t.id === taskId);
    if (task) {
      setUserPrompt(task.aiPrompt);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {tasks?.slice(0, 3).map((task: Task) => (
          <TaskCard
            key={task.id}
            task={task}
            isActive={activeTask === task.id}
            onClick={() => handleTryTask(task.id)}
          />
        )) || (
          <div className="col-span-3 text-center py-8 text-gray-500">
            📭 Nema zadataka u bazi. 
            <br />
            <a href="https://dashboard.convex.dev" className="text-blue-600 underline" target="_blank">
              Dodaj ih kroz Convex dashboard
            </a>
          </div>
        )}
      </div>

      {activeTask && (
        <div className="bg-blue-50 rounded-xl p-6 mt-6">
          <h4 className="font-bold text-lg mb-4">🚀 Isprobaj sam!</h4>
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tvoj prompt za AI:
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => alert('🤖 AI bi sada generirao odgovor!')}
            >
              Pošalji AI-ju
            </button>            
            <button 
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              onClick={() => setActiveTask(null)}
            >
              Zatvori
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LiveFeedWithConvex() {
  return (
    <ConvexProvider client={convex}>
      <LiveFeedContent />
    </ConvexProvider>
  );
}
