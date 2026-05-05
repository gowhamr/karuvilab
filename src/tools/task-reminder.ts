/* ===== task-reminder.ts – Local browser task manager ===== */

document.addEventListener('DOMContentLoaded', () => {
  const el = (id: string) => document.getElementById(id);
  const input = el('task-in') as HTMLInputElement;
  const addBtn = el('add-task-btn') as HTMLButtonElement;
  const container = el('task-container') as HTMLDivElement;
  const footer = el('task-footer') as HTMLDivElement;
  const stats = el('task-stats') as HTMLElement;
  const clearBtn = el('clear-completed') as HTMLButtonElement;

  interface Task {
    id: number;
    text: string;
    done: boolean;
    time: string;
  }

  let tasks: Task[] = JSON.parse(localStorage.getItem('karuvi_tasks') || '[]');

  function save() {
    localStorage.setItem('karuvi_tasks', JSON.stringify(tasks));
    render();
  }

  function render() {
    if (tasks.length === 0) {
      container.innerHTML = '<div class="empty-state">No tasks for today. Add one above!</div>';
      footer.style.display = 'none';
      return;
    }

    footer.style.display = 'flex';
    const remaining = tasks.filter(t => !t.done).length;
    stats.textContent = `${remaining} task${remaining === 1 ? '' : 's'} remaining`;

    container.innerHTML = '';
    tasks.forEach(task => {
      const item = document.createElement('div');
      item.className = `task-item ${task.done ? 'done' : ''}`;
      item.innerHTML = `
        <input type="checkbox" class="task-checkbox" ${task.done ? 'checked' : ''}>
        <span class="task-text">${task.text}</span>
        <span class="task-time">${task.time}</span>
        <span class="remove-task">×</span>
      `;

      item.querySelector('.task-checkbox')?.addEventListener('change', () => {
        task.done = !task.done;
        save();
      });

      item.querySelector('.remove-task')?.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        save();
      });

      container.appendChild(item);
    });
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const newTask: Task = {
      id: Date.now(),
      text: text,
      done: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    tasks.push(newTask);
    input.value = '';
    save();
  }

  addBtn.addEventListener('click', addTask);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  clearBtn.onclick = () => {
    tasks = tasks.filter(t => !t.done);
    save();
  };

  render();
});
