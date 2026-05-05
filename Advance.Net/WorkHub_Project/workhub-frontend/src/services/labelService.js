import api from "../api/axios";

export const getAllLabels = () => api.get("/labels");
export const createLabel = (data) => api.post("/labels", data);
export const deleteLabel = (id) => api.delete(`/labels/${id}`);
export const updateLabel =(id,data)=>api.put(`/labels/${id}`,data);