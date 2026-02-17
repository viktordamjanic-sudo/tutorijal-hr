'use client';

import { useUserProgress } from '../hooks/useUserProgress';
import { LESSONS } from '../lib/constants';

export default function UserStats() {
  const { progress, isLoading, isSignedIn } = useUserProgress();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 w-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-500">
        <div className="flex items-center gap-4">
          <span className="text-3xl">🔐</span>
          <div>
            <h3 className="font-bold text-lg">Prijavi se za praćenje napretka</h3>
            <p className="text-gray-600">Spremi svoje lekcije i zadatke!</p>
          </div>
          <a 
            href="/sign-in" 
            className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Prijavi se
          </a>
        </div>
      </div>
    );
  }

  const completedLessons = progress?.completedLessons?.length || 0;
  const completedTasks = progress?.completedTasks?.length || 0;
  const streak = progress?.streak || 0;
  const totalLessons = LESSONS.length;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
        <div className="text-3xl mb-2">📚</div>
        <div className="text-2xl font-bold">{completedLessons}/{totalLessons}</div>
        <div className="text-gray-600">Završenih lekcija</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
        <div className="text-3xl mb-2">🎮</div>
        <div className="text-2xl font-bold">{completedTasks}</div>
        <div className="text-gray-600">Riješenih zadataka</div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
        <div className="text-3xl mb-2">🔥</div>
        <div className="text-2xl font-bold">{streak}</div>
        <div className="text-gray-600">Dana u nizu</div>
      </div>
    </div>
  );
}
