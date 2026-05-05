import api from "../api/axios";

export const getAllUsers = () => api.get("/Users");
export const getUserById = (id) =>api.get(`/Users/${id}`);
export const createUser = (data) => api.post("/Users", data);
export const updateUser = (id, data) => api.put(`/Users/${id}`, data);
export const deleteUser = (id) => api.delete(`/Users/${id}`);


export const getNonAdminUsers = () => api.get("/Users/non-admin");
export const uploadUserProfileImage = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(
    `/Users/${userId}/upload-profile`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};


