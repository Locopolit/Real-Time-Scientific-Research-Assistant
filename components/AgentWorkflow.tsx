
import React from 'react';
import type { Task } from '../types';
import { TaskCard } from './TaskCard';

interface AgentWorkflowProps {
  tasks: Task[];
}

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-6">Agent Workflow Status</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskCard key={task.id} task={task} isLast={index === tasks.length - 1} />
        ))}
      </div>
    </div>
  );
};
