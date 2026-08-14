"use client";
import { useState, useEffect, useCallback } from "react";
import { ToolInput } from "@/components/ui/ToolInput";
import { useToast } from "@/components/ui/Toast";
import { sendNotification } from "@/src/lib/notifications";

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

function isOverdue(task: Task) {
  if (!task.dueDate || task.done) return false;
  return new Date(task.dueDate) < new Date(new Date().toDateString());
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

import { ToolWorkspace } from "@/components/ui/ToolWorkspace";

export default function TaskReminderClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newText, setNewText] = useState("");
  const [newDue, setNewDue] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const { toast } = useToast();

  useEffect(() => {
    const loaded = loadTasks();
    setTasks(loaded);
    setMounted(true);
    
    if ("Notification" in window) {
      setNotificationStatus(Notification.permission);
      if (Notification.permission === "default") {
        Notification.requestPermission().then(setNotificationStatus);
      }
    } else {
      setNotificationStatus('unsupported');
    }
    
    const overdueCount = loaded.filter(t => isOverdue(t)).length;
    const dueTodayCount = loaded.filter(t => !t.done && t.dueDate === new Date().toISOString().split("T")[0]).length;
    
    if (overdueCount > 0 || dueTodayCount > 0) {
      setTimeout(() => {
        sendNotification("Task Reminder", {
          body: `You have ${dueTodayCount} task(s) due today and ${overdueCount} overdue.`,
          icon: "/icon.png"
        });
      }, 2000);
    }
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
    toast("Task added successfully");
  };

  const toggleTask = (id: string) => {
    persist(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    persist(tasks.filter(t => t.id !== id));
    toast("Task deleted", "info");
  };

  const clearCompleted = () => {
    persist(tasks.filter(t => !t.done));
    toast("Cleared completed tasks");
  };

  const filtered = tasks.filter(t =>
    filter === "all" ? true :
    filter === "active" ? !t.done :
    t.done
  );

  const activeCount = tasks.filter(t => !t.done).length;

  if (!mounted) {
    return (
      <div className="bg-surface border border-border p-6 rounded-4xl min-h-80 animate-pulse" />
    );
  }

  const inputContent = (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,auto] items-end gap-4">
      <ToolInput
        label="What needs to be done?"
        value={newText}
        onChange={setNewText}
        placeholder="e.g., Renew passport, Finish project..."
        description="Stored Locally"
      />
      <div className="space-y-2 flex flex-col">
        <label className="text-sm font-bold text-text-2">Due Date</label>
        <input
          type="date"
          className="px-4 py-3 bg-bg border border-border rounded-xl focus:ring-4 focus:ring-blue/10 focus:border-blue outline-none transition-all text-sm font-medium h-[46px]"
          value={newDue}
          onChange={e => setNewDue(e.target.value)}
        />
      </div>
      <button
        onClick={addTask}
        disabled={!newText.trim()}
        className="h-[46px] px-8 bg-blue text-white font-black rounded-xl hover:scale-102 active:scale-98 transition-all shadow-md shadow-blue/10 disabled:opacity-50 disabled:grayscale disabled:scale-100"
      >
        Add Task
      </button>
    </div>
  );

  const outputContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-2">
        <div className="flex p-1 bg-bg border border-border rounded-xl">
          {(["all", "active", "completed"] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${filter === f ? "bg-blue text-white shadow-md shadow-blue/20" : "text-text-muted hover:text-text-2"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-text-muted uppercase tracking-widest">{activeCount} Pending</span>
          {tasks.some(t => t.done) && (
            <button onClick={clearCompleted} className="text-xs font-black text-red-500 uppercase tracking-widest hover:underline">
              Clear Done
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="text-4xl opacity-20 grayscale">📝</div>
          <p className="text-text-muted text-sm font-medium">
            {filter === "all" ? "Your task list is empty." :
             filter === "active" ? "No active tasks found." :
             "No completed tasks found."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/50">
          {filtered.map(task => {
            const overdue = isOverdue(task);
            return (
              <li key={task.id} className={`flex items-start gap-4 py-4 transition-all group ${task.done ? "opacity-50" : ""}`}>
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 transition-all ${task.done ? "bg-green-500 border-green-500 shadow-lg shadow-green-500/20" : "border-border bg-bg hover:border-blue"}`}
                >
                  {task.done && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm leading-snug ${task.done ? "line-through text-text-muted" : "text-text"}`}>{task.text}</p>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className={`text-xs font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${overdue ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-bg border border-border text-text-muted"}`}>
                        {overdue ? "Overdue" : "Due"}
                      </div>
                      <span className={`text-xs font-medium ${overdue ? "text-red-500" : "text-text-muted"}`}>
                        {new Date(task.dueDate + "T00:00:00").toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-1.5 text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 lg:opacity-100"
                  aria-label="Delete task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  const infoPanelContent = (
    <div className="space-y-4">
      <p className="text-xs text-text-muted text-center font-black uppercase tracking-widest-lg">
        Data secured on your device via LocalStorage
      </p>
      {notificationStatus === 'denied' && (
        <p className="text-xs text-error font-bold uppercase tracking-widest text-center w-full">
          ⚠️ Web Notifications are blocked. You will not receive background alerts for overdue tasks.
        </p>
      )}
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <ToolWorkspace
        layout="stacked"
        input={inputContent}
        output={outputContent}
        infoPanel={infoPanelContent}
      />
    </div>
  );
}

