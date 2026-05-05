import api from "../api/axios";

export const getAllTasks = () => api.get("/Tasks");
export const createTask = (data) => api.post("/Tasks", data);
export const deleteTask = (id) => api.delete(`/Tasks/${id}`);
export const getTaskById = (id) => api.get(`/Tasks/${id}`);
export const updateTask = (id, data) => api.put(`/Tasks/${id}`, data);

export const getUnassignedTasks = () => api.get("/Tasks/unassigned");

export const assignTask = (taskId, userId) => api.put(`/Tasks/${taskId}/assign/${userId}`);

export const assignLabelToTask = (taskId, labelId) => api.post("/tasklabels", { taskId, labelId });

export const removeLabelFromTask = (taskId, labelId) => api.delete(`/tasklabels/${taskId}/${labelId}`);


