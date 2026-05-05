import api from "../api/axios";

export const suggestAssignee = (taskTitle) =>
  api.post("/ai/suggest", {
    taskTitle: taskTitle
  });