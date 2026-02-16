'use client';

import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { PREDEFINED_TASKS, fetchAndGenerateTasks } from '../lib/newsIntegration';
import TaskCard from './ui/TaskCard';

export default function LiveFeed() {
  const [tasks, setTasks] = useState<Task[]>(PREDEFINED_TASKS.slice(0, 3));
  const [loading, setLoading] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [userPrompt, setUserPrompt] = useState('');

  useEffect(() => {
    async function loadTasks() {
      setLoading(true);
      try {
        const generated = await fetchAndGenerateTasks();
        if (generated.length > 0) {
          setTasks(generated);
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleTryTask = (taskId: string) => {
    setActiveTask(taskId);
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setUserPrompt(task.aiPrompt);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">AI generira zadatke iz vijesti... 🧠</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isActive={activeTask === task.id}
            onClick={() => handleTryTask(task.id)}
          />
        ))}
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
              placeholder="Upiši svoje pitanje AI-ju..."
            />
          </div>
          
          <div className="flex gap-3">
            <button 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => alert('🤖 AI bi sada generirao odgovor! (Demo mod)')}
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
          
          <p className="text-sm text-gray-600 mt-4">
            💡 <strong>Savjet:</strong> Budi što konkretniji. AI ne zna gdje živiš 
            — reci mu detalje!
          </p>
        </div>
      )}

      <div className="text-center">
        <button 
          className="text-blue-600 text-sm hover:underline"
          onClick={handleRefresh}
        >
          🔄 Osvježi zadatke iz novih vijesti
        </button>
      </div>
    </div>
  );
}
