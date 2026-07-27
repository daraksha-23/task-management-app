import React, { useRef } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDeleteModal({ isOpen, taskTitle, onConfirm, onCancel }) {
  const cancelButtonRef = useRef(null);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      titleId="modal-title"
      descriptionId="modal-description"
      initialFocusRef={cancelButtonRef}
    >
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
        <Button
          ref={cancelButtonRef}
          variant="secondary"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          className="w-full sm:w-auto"
        >
          Delete Task
        </Button>
      </div>
    </Modal>
  );
}

