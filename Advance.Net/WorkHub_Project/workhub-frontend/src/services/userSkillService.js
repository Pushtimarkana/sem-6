import api from "../api/axios";

export const assignSkillToUser = (userId, skillId, skillLevel) =>
  api.post("/userskills", {
    userId,
    skillId,
    skillLevel
  });

export const removeSkillFromUser = (userId, skillId) =>
  api.delete(`/userskills/${userId}/${skillId}`);

export const updateUserSkillLevel = (userId, skillId, skillLevel) =>
  api.put(`/userskills/${userId}/${skillId}`, {
    userId,
    skillId,
    skillLevel
  });


