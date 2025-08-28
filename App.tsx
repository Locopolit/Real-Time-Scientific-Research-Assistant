
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { AgentWorkflow } from './components/AgentWorkflow';
import { ReportOutput } from './components/ReportOutput';
import { runResearchAssistant } from './services/geminiService';
import type { Task } from './types';
import { TaskStatus } from './types';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>("What are the most promising small-molecule therapies for targeting the XYZ protein pathway that was identified in last week's Nature paper, and what are their known side effects?");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!query.trim()) {
      setError('Please enter a valid research query.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setTasks([]);
    setReport('');

    try {
      const result = await runResearchAssistant(query);
      
      const initialTasks: Task[] = result.tasks.map((task, index) => ({
        ...task,
        status: index === 0 ? TaskStatus.InProgress : TaskStatus.Pending,
        summary: '',
      }));
      setTasks(initialTasks);

      // Animate the workflow progress
      for (let i = 0; i < result.tasks.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
        
        setTasks(prevTasks => {
          const newTasks = [...prevTasks];
          newTasks[i] = {
            ...newTasks[i],
            status: TaskStatus.Completed,
            summary: result.tasks[i].summary,
          };
          if (i + 1 < newTasks.length) {
            newTasks[i + 1].status = TaskStatus.InProgress;
          }
          return newTasks;
        });
      }
      
      setReport(result.report);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Check the console.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg text-gray-400 mb-8">
            Enter a complex scientific query to begin the multi-agent research synthesis. The system will deconstruct your query, assign tasks to specialized agents, and generate a comprehensive report.
          </p>
          
          <QueryInput 
            query={query}
            setQuery={setQuery}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-4 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          <div className="mt-12">
            <AgentWorkflow tasks={tasks} />
          </div>

          {report && !isLoading && (
            <div className="mt-12">
              <ReportOutput report={report} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
