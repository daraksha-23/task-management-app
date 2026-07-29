import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import TaskForm from '../components/tasks/TaskForm';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';

export default function TaskFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, loading, addTask, updateTask } = useContext(TaskContext);

  const isEditMode = !!id;
  const currentTask = isEditMode ? tasks.find((t) => t.id === id) : null;

  // Handle task saving
 const handleSave = async (formData) => {
  try {
    if (isEditMode) {
      await updateTask(id, {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
      });
    } else {
      await addTask(
        formData.title,
        formData.description,
        formData.priority,
        formData.dueDate || null
      );
    }

    navigate('/dashboard');
  } catch (err) {
    // Re-throw so TaskForm's local catch can handle it and set form error states
    throw err;
  }
};

  const handleCancel = () => {
    navigate('/dashboard');
  };

  // If tasks are still loading, show a loading spinner
  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-10 w-15 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
      </div>
    );
  }

  // If edit mode is requested but the task ID is invalid or task is not found
  if (isEditMode && !currentTask) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Task Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The task you are trying to edit does not exist or has been deleted.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 focus-visible:outline-indigo-500"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go back to Dashboard</span>
          </Link>
        </div>
      </div>
    ); 
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Back to Dashboard Nav link */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white focus-visible:outline-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md sm:p-8 transition-colors">
        {/* Form Title */}
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
          <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl margin-0">
            {isEditMode ? 'Edit Task' : 'Create Task'}
          </h1>
        </div>

        {/* Task Form Component */}
        <TaskForm
          initialData={currentTask || {}}
          onSubmit={handleSave}
          onCancel={handleCancel}
          submitButtonLabel={isEditMode ? 'Update Task' : 'Create Task'}
        />
      </div>
    </div>
  );
}
