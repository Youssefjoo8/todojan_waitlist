"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, Reorder, motion, useDragControls } from "framer-motion";
import { Check, GripVertical, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { MAX_TASK_LENGTH, PRIORITY_STYLES } from "@/hooks/useTasks";

function TaskItem({ task, onToggle, onUpdate, onDelete, onCyclePriority, onDragStateChange }) {
  const controls = useDragControls();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      setDraft(task.text);
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing, task.text]);

  const commit = () => {
    if (draft.trim()) onUpdate(task.id, { text: draft });
    setIsEditing(false);
  };

  const stop = (e) => e.stopPropagation();

  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => onDragStateChange?.(true)}
      onDragEnd={() => onDragStateChange?.(false)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.10)", zIndex: 30 }}
      className="relative pl-2 pr-3 py-3 rounded-xl bg-white border border-black/5 flex items-center gap-2 group/task hover:bg-slate-50 hover:border-black/10 transition-colors duration-200 cursor-pointer"
      onClick={() => !isEditing && onToggle(task.id)}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="p-1 rounded text-charcoal/25 hover:text-charcoal/60 cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
        onPointerDown={(e) => {
          e.stopPropagation();
          controls.start(e);
        }}
        onClick={stop}
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Checkbox */}
      <button
        type="button"
        role="checkbox"
        aria-checked={task.completed}
        aria-label={task.completed ? "Mark as not done" : "Mark as done"}
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
          task.completed ? "bg-accent-purple border-accent-purple" : "border-black/20 hover:border-accent-purple/50"
        }`}
        onClick={(e) => {
          stop(e);
          onToggle(task.id);
        }}
      >
        <AnimatePresence>
          {task.completed && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Text / inline editor */}
      <div className="flex-1 min-w-0 pl-1">
        {isEditing ? (
          <input
            ref={inputRef}
            value={draft}
            maxLength={MAX_TASK_LENGTH}
            onChange={(e) => setDraft(e.target.value)}
            onClick={stop}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            aria-label="Edit task"
            className="w-full bg-white border border-accent-purple/40 rounded-md px-2 py-1 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-accent-purple/20 select-text"
          />
        ) : (
          <span
            onDoubleClick={(e) => {
              stop(e);
              setIsEditing(true);
            }}
            className={`block text-sm md:text-[15px] font-medium select-none truncate transition-colors duration-300 ${
              task.completed ? "line-through text-charcoal/30" : "text-charcoal/90"
            }`}
            title={task.text}
          >
            {task.text}
          </span>
        )}
      </div>

      {/* Row actions: always visible on touch, revealed on hover/focus on desktop */}
      {!isEditing && (
        <div className="flex items-center gap-0.5 flex-shrink-0 opacity-100 lg:opacity-0 lg:group-hover/task:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <button
            type="button"
            aria-label="Edit task"
            onClick={(e) => {
              stop(e);
              setIsEditing(true);
            }}
            className="p-1.5 rounded-md text-charcoal/40 hover:text-accent-purple hover:bg-accent-purple/10 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Delete task"
            onClick={(e) => {
              stop(e);
              onDelete(task.id);
            }}
            className="p-1.5 rounded-md text-charcoal/40 hover:text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Priority badge — click to cycle */}
      <button
        type="button"
        onClick={(e) => {
          stop(e);
          onCyclePriority(task.id);
        }}
        title="Click to change priority"
        className={`text-xs px-2.5 py-0.5 rounded font-semibold tracking-wide flex-shrink-0 transition-transform active:scale-95 ${PRIORITY_STYLES[task.priority]}`}
      >
        {task.priority}
      </button>
    </Reorder.Item>
  );
}

export default function TaskBoard({ store, onDragStateChange }) {
  const { tasks, addTask, updateTask, toggleTask, cyclePriority, deleteTask, reorderTasks, clearCompleted, resetTasks } =
    store;
  const [newText, setNewText] = useState("");

  const remaining = tasks.filter((t) => !t.completed).length;
  const hasCompleted = tasks.length !== remaining;

  const handleAdd = (e) => {
    e.preventDefault();
    if (addTask(newText)) setNewText("");
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Add task */}
      <form onSubmit={handleAdd} className="flex items-center gap-2">
        <input
          id="new-task-input"
          value={newText}
          maxLength={MAX_TASK_LENGTH}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Add a task and press Enter…"
          aria-label="New task"
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-black/10 bg-slate-50 text-sm text-charcoal placeholder-charcoal/35 focus:border-accent-purple focus:ring-2 focus:ring-accent-purple/15 focus:outline-none transition-all select-text"
        />
        <button
          id="add-task-btn"
          type="submit"
          disabled={!newText.trim()}
          className="px-3.5 py-2.5 rounded-xl bg-charcoal text-light text-sm font-semibold flex items-center gap-1.5 hover:bg-charcoal/90 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>

      {/* List */}
      <motion.div layoutScroll className="max-h-[300px] overflow-y-auto pr-1 -mr-1">
        {tasks.length === 0 ? (
          <div className="py-10 text-center text-sm text-charcoal/40 border border-dashed border-black/10 rounded-xl">
            No tasks yet. Add one above, or{" "}
            <button type="button" onClick={resetTasks} className="text-accent-purple font-semibold hover:underline">
              restore the demo tasks
            </button>
            .
          </div>
        ) : (
          <Reorder.Group axis="y" values={tasks} onReorder={reorderTasks} className="flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onUpdate={updateTask}
                  onDelete={deleteTask}
                  onCyclePriority={cyclePriority}
                  onDragStateChange={onDragStateChange}
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
        )}
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-charcoal/40 pt-1">
        <span>
          {remaining} {remaining === 1 ? "task" : "tasks"} remaining
        </span>
        <div className="flex items-center gap-3">
          {hasCompleted && (
            <button
              id="clear-completed-btn"
              type="button"
              onClick={clearCompleted}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Clear completed
            </button>
          )}
          <button
            id="reset-tasks-btn"
            type="button"
            onClick={resetTasks}
            className="flex items-center gap-1 hover:text-accent-purple transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset demo
          </button>
        </div>
      </div>
    </div>
  );
}
