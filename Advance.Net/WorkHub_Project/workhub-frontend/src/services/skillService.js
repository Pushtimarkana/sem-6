import api from "../api/axios";

export const getAllSkills = () => api.get("/Skills");
export const deleteSkill = (id) => api.delete(`/Skills/${id}`)
export const createSkill = (data) => api.post(`/Skills`,data)
export const updateSkill =(id,data)=>api.put(`/Skills/${id}`,data)