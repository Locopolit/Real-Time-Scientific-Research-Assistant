
import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import { ResearchAgentIcon, BiologyExpertIcon, DataAnalysisAgentIcon, SynthesisAgentIcon, GenericAgentIcon, CheckCircleIcon, CubeTransparentIcon, ClockIcon } from './icons';

interface TaskCardProps {
  task: Task;
  isLast: boolean;
}

const getAgentIcon = (agentName: string) => {
  const lowerAgentName = agentName.toLowerCase();
  if (lowerAgentName.includes('research')) return <ResearchAgentIcon className="w-6 h-6" />;
  if (lowerAgentName.includes('biology') || lowerAgentName.includes('expert')) return <BiologyExpertIcon className="w-6 h-6" />;
  if (lowerAgentName.includes('data') || lowerAgentName.includes('analysis')) return <DataAnalysisAgentIcon className="w-6 h-6" />;
  if (lowerAgentName.includes('synthesis')) return <SynthesisAgentIcon className="w-6 h-6" />;
  return <GenericAgentIcon className="w-6 h-6" />;
};

const getStatusIndicator = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.Completed:
      return <div className="flex items-center space-x-2 text-emerald-400"><CheckCircleIcon className="w-5 h-5" /><span>Completed</span></div>;
    case TaskStatus.InProgress:
      return <div className="flex items-center space-x-2 text-yellow-400 animate-pulse"><CubeTransparentIcon className="w-5 h-5" /><span>In Progress...</span></div>;
    case TaskStatus.Pending:
      return <div className="flex items-center space-x-2 text-gray-500"><ClockIcon className="w-5 h-5" /><span>Pending</span></div>;
    default:
      return null;
  }
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isLast }) => {
  const isCompleted = task.status === TaskStatus.Completed;

  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center mr-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isCompleted ? 'bg-cyan-500' : 'bg-gray-700'} border-2 ${isCompleted ? 'border-cyan-400' : 'border-gray-600'} transition-colors`}>
          {getAgentIcon(task.agent)}
        </div>
        {!isLast && <div className={`w-0.5 h-16 mt-2 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>}
      </div>
      
      <div className={`w-full p-4 rounded-lg border-2 transition-all duration-500 ${isCompleted ? 'bg-gray-800/70 border-cyan-700/50' : 'bg-gray-800/50 border-gray-700'}`}>
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-cyan-400">{task.agent}</p>
            <p className="text-gray-300">{task.description}</p>
          </div>
          <div className="font-semibold text-sm whitespace-nowrap ml-4">
            {getStatusIndicator(task.status)}
          </div>
        </div>
        {isCompleted && task.summary && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <p className="text-sm text-gray-400 italic"><span className="font-semibold text-gray-300">Finding:</span> {task.summary}</p>
          </div>
        )}
      </div>
    </div>
  );
};
