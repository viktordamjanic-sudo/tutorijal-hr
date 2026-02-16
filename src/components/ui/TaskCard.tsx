'use client';

import { useState } from 'react';
import type { Task } from '../../types';
import { getDifficultyLabel } from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  isActive?: boolean;
  onClick?: () => void;
  showLink?: boolean;
}

export default function TaskCard({ task, isActive, onClick, showLink = true }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };
  
  const CardWrapper = showLink ? 'a' : 'div';
  const wrapperProps = showLink 
    ? { href: `/modul/${task.id}`, className: 'block' }
    : { className: 'block cursor-pointer', onClick };

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm border-2 transition-all ${
        isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
      } ${isHovered ? 'shadow-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardWrapper {...wrapperProps}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{task.icon}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${difficultyColors[task.difficulty]}`}>
            {getDifficultyLabel(task.difficulty)}
          </span>
        </div>
        
        <h3 className="font-bold text-gray-800 mb-2 hover:text-blue-600 transition">
          {task.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.scenario}
        </p>
      </CardWrapper>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Generirano: {task.generatedAt || 'Danas'}
        </span>        
        {showLink && (
          <a 
            href={`/modul/${task.id}`} 
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Isprobaj →
          </a>
        )}
      </div>
    </div>
  );
}
