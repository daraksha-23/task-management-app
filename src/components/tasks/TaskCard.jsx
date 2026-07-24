import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, Circle, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import PriorityBadge from '../ui/PriorityBadge';

export default function TaskCard({ 
  task, 
  index, 
  totalTasks, 
  isReorderEnabled, 
  onToggleStatus, 
  onDeleteClick, 
  onReorderTasks,
  draggedIndex,
  setDraggedIndex
}) {
  const cardRef = useRef(null);

  // pointer event handlers for dragging
  const handlePointerDown = (e) => {
    if (!isReorderEnabled) return;
    
    // Only start dragging if the grip handle is clicked
    const target = e.target;
    if (!target.closest('.drag-handle')) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggedIndex(index);
  };

  const handlePointerMove = (e) => {
    if (draggedIndex === null || draggedIndex === undefined) return;
    
    // Perform hit detection using client coordinate space
    const elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
    if (!elementUnderPointer) return;

    const targetCard = elementUnderPointer.closest('.task-card-container');
    if (targetCard) {
      const targetIndex = parseInt(targetCard.getAttribute('data-index'), 10);
      if (!isNaN(targetIndex) && targetIndex !== index) {
        onReorderTasks(index, targetIndex);
      }
    }
  };

  const handlePointerUp = (e) => {
    if (draggedIndex === null || draggedIndex === undefined) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDraggedIndex(null);
  };

  const isDragging = draggedIndex === index;

  return (
    <div 
      ref={cardRef}
      data-index={index}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`task-card-container group relative flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all focus-within:ring-2 focus-within:ring-indigo-500 bg-white dark:bg-slate-900 transition-colors ${
        task.completed 
          ? 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20' 
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      } ${
        isDragging 
          ? 'opacity-40 border-indigo-400 dark:border-indigo-500 scale-[0.98] shadow-md touch-none cursor-grabbing z-40' 
          : ''
      }`}
    >
      <div className="flex items-start space-x-2">
        {/* Grip Handle for Dragging (Visible when reordering is enabled) */}
        {isReorderEnabled && (
          <div 
            className="drag-handle mt-2.5 cursor-grab text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 focus-visible:outline-indigo-500 rounded p-1 min-w-[32px] min-h-[32px] flex items-center justify-center"
            tabIndex={0}
            role="button"
            aria-label="Drag task to reorder"
          >
            <GripVertical className="h-5 w-5" />
          </div>
        )}

        {/* Toggle Status Checkbox Button */}
        <button
          type="button"
          onClick={() => onToggleStatus(task.id)}
          className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 focus-visible:outline-indigo-500 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        >
          {task.completed ? (
            <CheckCircle className="h-5.5 w-5.5 text-emerald-600 dark:text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
          ) : (
            <Circle className="h-5.5 w-5.5 text-slate-300 dark:text-slate-600" />
          )}
        </button>

        {/* Task Details */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 
              className={`text-sm font-semibold tracking-tight text-slate-900 dark:text-white break-words ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.title}
            </h4>
            <PriorityBadge priority={task.priority} />
          </div>
          
          {task.description && (
            <p 
              className={`mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap break-words ${
                task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          {task.dueDate ? (() => {
            const isOverdue = !task.completed && new Date(task.dueDate).setHours(23, 59, 59, 999) < new Date().setHours(0, 0, 0, 0);
            return (
              <div className="mt-2.5">
                <span className={`inline-flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${
                  isOverdue
                    ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30 animate-pulse'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>
                  <span>{isOverdue ? 'Overdue:' : 'Due:'}</span>
                  <span>{task.dueDate}</span>
                </span>
              </div>
            );
          })() : (
            <div className="mt-2.5">
              <span className="inline-flex items-center rounded px-2 py-0.5 text-[10px] font-semibold border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/10 text-slate-400 dark:text-slate-500">
                No due date
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Task Actions Section */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
        {/* Keyboard Reordering fallbacks */}
        {isReorderEnabled ? (
          <div className="flex space-x-1" role="group" aria-label="Reorder task positions">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onReorderTasks(index, index - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 focus-visible:outline-indigo-500"
              aria-label={`Move task "${task.title}" up`}
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={index === totalTasks - 1}
              onClick={() => onReorderTasks(index, index + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-white dark:disabled:hover:bg-slate-800 focus-visible:outline-indigo-500"
              aria-label={`Move task "${task.title}" down`}
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div /> // spacing layout placeholder
        )}

        <div className="flex space-x-2">
          <Link
            to={`/tasks/${task.id}/edit`}
            className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:outline-indigo-500 min-h-[44px]"
            aria-label={`Edit task "${task.title}"`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(task)}
            className="inline-flex items-center space-x-1 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 focus-visible:outline-red-600 min-h-[44px]"
            aria-label={`Delete task "${task.title}"`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
