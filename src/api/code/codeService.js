import api from "@/api/axios";


export const codeService = {
  list: (url, data) => api.post(url, data),
  updateInsert: (url, data) => api.put(url, data),
};