import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import SearchBar from '../components/ui/SearchBar';
import StatusFilters from '../components/ui/StatusFilters';
import TaskList from '../components/tasks/TaskList';
import EmptyState from '../components/tasks/EmptyState';
import ConfirmDeleteModal from '../components/tasks/ConfirmDeleteModal';
import ErrorMessage from '../components/ui/ErrorMessage';
import { Plus, Info } from 'lucide-react';

export default function Dashboard() {
  const {
    tasks,
    loading,
    storageError,
    feedback,
    writeWarning,
    toggleTaskStatus,
    deleteTask,
    reorderTasks,
    resetStorage,
  } = useContext(TaskContext);

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deletingTask, setDeletingTask] = useState(null);

  // Compute status counts for the filter pills
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  // Filter tasks based on search terms and selected filter
  const filteredTasks = tasks.filter((task) => {
    // 1. Filter by status
    if (statusFilter === 'Pending' && task.completed) return false;
    if (statusFilter === 'Completed' && !task.completed) return false;

    // 2. Filter by search text (case-insensitive title and description)
    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchDesc = (task.description || '').toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }

    return true;
  });

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('All');
  };

  // Render Corruption screen immediately if storage is broken
  if (storageError === 'CORRUPTED') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage type="corrupted" onAction={resetStorage} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* feedback / inline toast */}
      {feedback && (
        <div className="fixed bottom-4 right-4 z-50 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg flex items-center space-x-2 animate-in slide-in-from-bottom-5">
          <Info className="h-4.5 w-4.5 text-indigo-400" />
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Write Warning Notification */}
      {writeWarning && (
        <div className="mb-6">
          <ErrorMessage type="warning" />
        </div>
      )}

      {/* Dashboard Top Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white margin-0">
            Task Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage, organize, and prioritize your active project targets.
          </p>
        </div>
        <div>
          <Link
            to="/tasks/new"
            className="inline-flex items-center justify-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:outline-none min-h-[44px]"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Task</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search controls */}
      {tasks.length > 0 && (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-md">
            <SearchBar
              value={searchText}
              onChange={setSearchText}
              onClear={() => setSearchText('')}
            />
          </div>
          <div className="flex-shrink-0">
            <StatusFilters
              activeFilter={statusFilter}
              onFilterChange={setStatusFilter}
              counts={counts}
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState type="empty" />
      ) : filteredTasks.length === 0 ? (
        <EmptyState type="no-results" onClearFilters={handleClearFilters} />
      ) : (
        <TaskList
          tasks={filteredTasks}
          isReorderEnabled={statusFilter === 'All' && !searchText.trim()}
          onToggleStatus={toggleTaskStatus}
          onDeleteClick={(task) => setDeletingTask(task)}
          onReorderTasks={reorderTasks}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteModal
        isOpen={!!deletingTask}
        taskTitle={deletingTask?.title || ''}
        onConfirm={async () => {
          if (!deletingTask) {
            return;
          }
          try {
            await deleteTask(deletingTask.id);
            setDeletingTask(null);
          } catch {
            // Keeping  the modal open when deletion fails.
          }
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
