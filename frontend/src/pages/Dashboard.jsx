import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import SearchBar from '../components/ui/SearchBar';
import StatusFilters from '../components/ui/StatusFilters';
import TaskList from '../components/tasks/TaskList';
import EmptyState from '../components/tasks/EmptyState';
import ConfirmDeleteModal from '../components/tasks/ConfirmDeleteModal';
import ErrorMessage from '../components/ui/ErrorMessage';
import { Plus, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const {
    tasks,
    pagination,
    loading,
    storageError,
    feedback,
    writeWarning,
    toggleTaskStatus,
    deleteTask,
    reorderTasks,
    resetStorage,
    loadTasks,
  } = useContext(TaskContext);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [deletingTask, setDeletingTask] = useState(null);

  // Debounce search input by 400ms and reset page to 1 on search change
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== searchText) {
          setPage(1);
        }
        return searchText;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleStatusFilterChange = (filter) => {
    setStatusFilter(filter);
    setPage(1);
  };

  const handlePriorityFilterChange = (filter) => {
    setPriorityFilter(filter);
    setPage(1);
  };

  // Fetch paginated and filtered tasks from backend
  useEffect(() => {
    const params = {
      page,
      limit: 9,
    };

    if (debouncedSearch.trim()) {
      params.search = debouncedSearch.trim();
    }

    if (statusFilter === 'Pending') {
      params.status = 'pending';
    } else if (statusFilter === 'Completed') {
      params.status = 'completed';
    }

    if (priorityFilter && priorityFilter !== 'All') {
      params.priority = priorityFilter.toLowerCase();
    }

    loadTasks(params);
  }, [debouncedSearch, statusFilter, priorityFilter, page, loadTasks]);

  // Adjust page boundary if current page > totalPages after deletions
  useEffect(() => {
    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages);
    }
  }, [pagination.totalPages, page]);

  const counts = {
    all: pagination.totalTasks || tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  const handleClearFilters = () => {
    setSearchText('');
    setStatusFilter('All');
    setPriorityFilter('All');
  };

  const isReorderEnabled =
    !searchText.trim() &&
    statusFilter === 'All' &&
    priorityFilter === 'All' &&
    pagination.totalPages <= 1;

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
            onFilterChange={handleStatusFilterChange}
            counts={counts}
          />
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
      ) : tasks.length === 0 ? (
        debouncedSearch.trim() || statusFilter !== 'All' ? (
          <EmptyState type="no-results" onClearFilters={handleClearFilters} />
        ) : (
          <EmptyState type="empty" />
        )
      ) : (
        <>
          <TaskList
            tasks={tasks}
            isReorderEnabled={isReorderEnabled}
            onToggleStatus={toggleTaskStatus}
            onDeleteClick={(task) => setDeletingTask(task)}
            onReorderTasks={reorderTasks}
          />

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition min-h-[44px]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={!pagination.hasNextPage || loading}
                onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition min-h-[44px]"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
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
            // Keep modal open on deletion failure
          }
        }}
        onCancel={() => setDeletingTask(null)}
      />
    </div>
  );
}
