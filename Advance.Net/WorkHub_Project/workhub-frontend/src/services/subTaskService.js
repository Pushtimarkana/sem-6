import api from "../api/axios";

export const getAllSubTasks = () => api.get("/SubTasks");
export const createSubTask = (data) => api.post("/SubTasks", data);
export const toggleSubTask = (id) => api.put(`/SubTasks/${id}/toggle`);
// export const deleteSubTask = (id) => api.delete(`/SubTasks/${id}`);
export const deleteSubTask=(id)=>{
  try {
    return api.delete(`/subtasks/${id}`);
    // alert("Deleted successfully");
} catch (err) {
  if (err.response?.status === 403) {
    alert("You are not allowed to delete this subtask");
  }
}
}



