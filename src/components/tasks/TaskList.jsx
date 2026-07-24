import React, { useState } from 'react';
import TaskCard from './TaskCard';

export default function TaskList({ 
  tasks, 
  isReorderEnabled, 
  onToggleStatus, 
  onDeleteClick, 
  onReorderTasks 
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task, index) => (
        <TaskCard
          key={task.id}
          task={task}
          index={index}
          totalTasks={tasks.length}
          isReorderEnabled={isReorderEnabled}
          onToggleStatus={onToggleStatus}
          onDeleteClick={onDeleteClick}
          onReorderTasks={onReorderTasks}
          draggedIndex={draggedIndex}
          setDraggedIndex={setDraggedIndex}
        />
      ))}
    </div>
  );
}
