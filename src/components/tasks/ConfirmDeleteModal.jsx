import React, { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';

export default function ConfirmDeleteModal({ isOpen, taskTitle, onConfirm, onCancel }) {
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Focus trap and escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Focus the cancel/no button by default to prevent accidental deletes
    cancelButtonRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean);
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      ref={modalRef}
    >
      <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon and Heading */}
        <div className="flex items-start space-x-3.5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
          </div>
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Task
            </h3>
            <p id="modal-description" className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete task <span className="font-semibold text-slate-900 dark:text-white">"{taskTitle}"</span>? 
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Buttons Panel */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            ref={cancelButtonRef}
            onClick={onCancel}
            className="inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="inline-flex justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:outline-none min-h-[44px]"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
