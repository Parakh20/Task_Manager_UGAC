'use client';
import { Task } from '@/types/task';

import { useTask } from '@/context/TaskContext';
import { getStatusColor } from '@/utils/taskUtils';
import {
  CheckSquare,
  Paperclip,
  MessageCircle,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Priority color mapping (bright, like your original app)
const priorityColors = {
  High: 'bg-red-500 text-white',
  Medium: 'bg-orange-400 text-white',
  Low: 'bg-blue-600 text-white',
};

const statuses = ['Todo', 'In Progress', 'Done'];

interface TaskBoardProps {
  onEditTask: (task: Task) => void;
}

export default function TaskBoard({ onEditTask }: TaskBoardProps) {
  const { tasks, updateTask, reorderTasks } = useTask();

  // Group tasks by status
  const tasksByStatus = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter(task => task.status === status);
    return acc;
  }, {} as Record<string, Task[]>);

  function onDragEnd(result: any) {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const movedTask = tasks.find(t => t.id === draggableId);
    if (!movedTask) return;

    if (source.droppableId !== destination.droppableId) {
      updateTask(movedTask.id, { status: destination.droppableId });
    } else {
      reorderTasks(source.droppableId, source.index, destination.index);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:px-6">
        {statuses.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  rounded-2xl 
                  bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900
                  shadow-neumorph
                  p-0 min-h-[420px] flex flex-col
                  border border-gray-100 dark:border-gray-800
                  transition-all
                  ${snapshot.isDraggingOver ? 'ring-2 ring-primary-400' : ''}
                `}
              >
                {/* Column Header with colored dot and pill */}
                <div className="flex items-center font-bold text-lg px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                  <span className={`w-2 h-6 mr-3 rounded-full ${
                    status === 'Todo' ? 'bg-blue-400'
                    : status === 'In Progress' ? 'bg-orange-400'
                    : 'bg-green-400'
                  }`} />
                  <span className={`
                    px-3 py-1 rounded-full bg-white/90 dark:bg-gray-900/90
                    font-semibold shadow-sm
                    ${status === 'Todo' ? 'text-blue-500'
                      : status === 'In Progress' ? 'text-orange-400'
                      : 'text-green-400'
                    }
                  `}>
                    {status}
                  </span>
                </div>
                <div className="flex-1 flex flex-col gap-5 px-6 py-6">
                  {tasksByStatus[status].length === 0 && (
                    <div className="text-gray-400 dark:text-gray-500 text-base italic text-center mt-16">
                      No tasks
                    </div>
                  )}
                  {tasksByStatus[status].map((task, idx) => (
                    <Draggable draggableId={task.id} index={idx} key={task.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            relative rounded-xl px-5 py-4
                            bg-white dark:bg-gray-950
                            border border-gray-100 dark:border-gray-800
                            cursor-pointer
                            shadow-neumorph
                            hover:shadow-neumorph-hover
                            hover:scale-[1.025]
                            active:scale-95
                            transition-all duration-200
                            flex items-start gap-3
                            ${snapshot.isDragging ? 'ring-4 ring-primary-400 scale-105 z-20 shadow-neumorph-active' : ''}
                          `}
                          onClick={() => onEditTask(task)}
                        >
                          {/* Priority dot */}
                          <span
                            className={`
                              w-2 h-8 rounded-full mr-2 mt-1
                              ${task.priority === 'High' ? 'bg-red-500'
                                : task.priority === 'Medium' ? 'bg-orange-400'
                                : 'bg-blue-600'}
                            `}
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate text-lg">{task.title}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : ''}
                            </div>
                            {/* Tags - Defensive rendering */}
                            <div className="mt-2 flex flex-wrap gap-2">
                              {task.tags &&
                                (Array.isArray(task.tags)
                                  ? task.tags.map((tag, i) => (
                                      <span
                                        key={i}
                                        className="bg-gray-100 dark:bg-gray-800 text-xs rounded-full px-2 py-0.5 text-gray-500 dark:text-gray-400"
                                      >
                                        {tag}
                                      </span>
                                    ))
                                  : typeof task.tags === 'string'
                                    ? task.tags.split(',').map((tag, i) => (
                                        <span
                                          key={i}
                                          className="bg-gray-100 dark:bg-gray-800 text-xs rounded-full px-2 py-0.5 text-gray-500 dark:text-gray-400"
                                        >
                                          {tag.trim()}
                                        </span>
                                      ))
                                    : null
                                )
                              }
                            </div>
                            {/* Subtasks / Checklist summary */}
                            {task.subtasks?.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <CheckSquare className="h-4 w-4" />
                                {task.subtasks.filter(st => st.completed).length} / {task.subtasks.length} subtasks completed
                              </div>
                            )}
                            {/* Attachments summary */}
                            {task.attachments?.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <Paperclip className="h-4 w-4" />
                                {task.attachments.length} attachment{task.attachments.length > 1 ? 's' : ''}
                              </div>
                            )}
                            {/* Comments summary */}
                            {task.comments?.length > 0 && (
                              <div className="flex items-center gap-2 mt-2 text-xs text-gray-600 dark:text-gray-400">
                                <MessageCircle className="h-4 w-4" />
                                {task.comments.length} comment{task.comments.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                          {/* Priority badge (top-right) */}
                          <span
                            className={`absolute top-4 right-5 px-2 py-0.5 rounded-full text-xs font-semibold shadow
                              ${priorityColors[task.priority] || 'bg-slate-500 text-white'}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
