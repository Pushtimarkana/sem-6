// src/services/notificationService.js
// Derives notifications from tasks assigned to the logged-in user.
// No backend changes needed — works entirely from your existing task API.

import axios from "axios";

const BASE = "https://localhost:7039/api";

// Fetch all tasks assigned to a specific user
export const getTasksForUser = (userId) =>
  axios.get(`${BASE}/Tasks/assigned/${userId}`);

// ── Build notifications from task data ───────────────────────────────────────
// Call this after fetching the user's tasks.
// Returns array of notification objects sorted newest-first.
export function buildNotifications(tasks = [], readIds = []) {
  const now  = new Date();
  const list = [];

  tasks.forEach(task => {
    const due     = task.dueDate ? new Date(task.dueDate) : null;
    const msLeft  = due ? due - now : null;
    const daysLeft = msLeft !== null ? Math.ceil(msLeft / (1000 * 60 * 60 * 24)) : null;

    // 1. Task assigned notification (always shown)
    list.push({
      id:        `assigned-${task.taskId}`,
      type:      "assigned",
      taskId:    task.taskId,
      title:     "New Task Assigned",
      message:   `You have been assigned "${task.title}"`,
      time:      task.createdAt ?? null,
      read:      readIds.includes(`assigned-${task.taskId}`),
      priority:  task.priority,
      icon:      "📋",
    });

    // 2. Deadline today
    if (daysLeft !== null && daysLeft === 0 && task.status !== "Completed") {
      list.push({
        id:       `deadline-today-${task.taskId}`,
        type:     "deadline",
        taskId:   task.taskId,
        title:    "Due Today!",
        message:  `"${task.title}" is due today`,
        time:     due.toISOString(),
        read:     readIds.includes(`deadline-today-${task.taskId}`),
        priority: task.priority,
        icon:     "🔴",
      });
    }

    // 3. Deadline tomorrow
    if (daysLeft !== null && daysLeft === 1 && task.status !== "Completed") {
      list.push({
        id:       `deadline-tomorrow-${task.taskId}`,
        type:     "deadline",
        taskId:   task.taskId,
        title:    "Due Tomorrow",
        message:  `"${task.title}" is due tomorrow`,
        time:     due.toISOString(),
        read:     readIds.includes(`deadline-tomorrow-${task.taskId}`),
        priority: task.priority,
        icon:     "⚠️",
      });
    }

    // 4. Overdue
    if (daysLeft !== null && daysLeft < 0 && task.status !== "Completed") {
      list.push({
        id:       `overdue-${task.taskId}`,
        type:     "overdue",
        taskId:   task.taskId,
        title:    "Task Overdue",
        message:  `"${task.title}" is overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) > 1 ? "s" : ""}`,
        time:     due.toISOString(),
        read:     readIds.includes(`overdue-${task.taskId}`),
        priority: task.priority,
        icon:     "❌",
      });
    }

    // 5. Task completed
    if (task.status === "Completed") {
      list.push({
        id:       `completed-${task.taskId}`,
        type:     "completed",
        taskId:   task.taskId,
        title:    "Task Completed",
        message:  `"${task.title}" has been marked as completed`,
        time:     task.updatedAt ?? null,
        read:     readIds.includes(`completed-${task.taskId}`),
        priority: task.priority,
        icon:     "✅",
      });
    }
  });

  // Sort: unread first, then by urgency type order
  const typeOrder = { overdue: 0, deadline: 1, assigned: 2, completed: 3 };
  return list.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    return (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9);
  });
}

// ── Persist read state in localStorage per user ──────────────────────────────
export function getReadIds(userId) {
  try {
    return JSON.parse(localStorage.getItem(`notif_read_${userId}`) ?? "[]");
  } catch { return []; }
}

export function saveReadIds(userId, ids) {
  localStorage.setItem(`notif_read_${userId}`, JSON.stringify(ids));
}