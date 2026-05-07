"use client";
import { useState, useEffect, useCallback } from "react";

const LS_KEY = "karuvilab-tasks";

interface Task {
  id: string;
  text: string;
  dueDate: string;
  done: boolean;
  createdAt: string;
}

type Filter = "all" | "active" | "completed";

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? "[]");
  } catch { return []; }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

export default function TaskReminderClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newText, setNewText] = useState("");
  const [newDue, setNewDue] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTasks(loadTasks());
    setMounted(true);
  }, []);

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated);
    saveTasks(updated);
  }, []);

  const addTask = () => {
    if (!newText.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newText.trim(),
      dueDate: newDue,
      done: false,
      createdAt: new Date().toISOString(),
    };
    persist([task, ...tasks]);
    setNewText("");
    setNewDue("");
  };

  const toggleTask = (id: string) => {
    persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    persist(tasks.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    persist(tasks.filter(t => !t.done));
  };

  const isOverdue = (task: Task) => {
    if (!task.dueDate || task.done) return false;
    return new Date(task.dueDate) < new Date(new Date().toDateString());
  };

  const filtered = tasks.filter(t =>
    filter === "all" ? true :
    filter === "active" ? !t.done :
    t.done
  );

  const activeCount = tasks.filter(t => !t.done).length;

  if (!mounted) {
    return (
      <div className="bg-surface border border-border p-6 rounded-2xl h-32 animate-pulse" />
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm space-y-4">
        <label className="text-sm font-bold text-text-2">Add New Task</label>
        <div className="flex gap-3 flex-col sm:flex-row">
          <input
            type="text"
            className="flex-1 px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all"
            placeholder="What needs to be done?"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
          />
          <input
            type="date"
            className="px-4 py-3 bg-bg border border-border rounded-xl focus:ring-2 focus:ring-blue outline-none transition-all text-sm"
            value={newDue}
            onChange={e => setNewDue(e.target.value)}
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-blue text-white font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
          >
            Add Task
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex gap-1">
            {(["all", "active", "completed"] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${filter === f ? "bg-blue text-white" : "hover:bg-bg text-text-2"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-4">{activeCount} left</span>
            {tasks.some(t => t.done) && (
              <button onClick={clearCompleted} className="text-xs text-red-500 hover:underline">
                Clear completed
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-text-4 text-sm">
            {filter === "all" ? "No tasks yet. Add one above!" :
             filter === "active" ? "No active tasks." :
             "No completed tasks."}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map(task => {
              const overdue = isOverdue(task);
              return (
                <li key={task.id} className={`flex items-start gap-3 p-4 transition-colors hover:bg-bg ${task.done ? "opacity-60" : ""}`}>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.done ? "bg-green-500 border-green-500" : "border-border hover:border-blue"}`}
                  >
                    {task.done && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.done ? "line-through text-text-4" : "text-text"}`}>{task.text}</p>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 mt-0.5">
                        {overdue && (
                          <span className="text-xs font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">Overdue</span>
                        )}
                        <span className={`text-xs ${overdue ? "text-red-500" : "text-text-4"}`}>
                          Due: {new Date(task.dueDate + "T00:00:00").toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-text-4 hover:text-red-500 transition-colors text-lg leading-none px-1"
                    aria-label="Delete task"
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <p className="text-xs text-text-4 text-center">
        Tasks are saved in your browser's localStorage and persist between sessions.
      </p>
    </div>
  );
}
