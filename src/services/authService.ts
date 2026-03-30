import api from "../utils/axios";

export const getMe = ()=> api.get("/auth/me");
export const login = (data: {email: string; password: string}) => api.post("/auth/login", data);
export const register = (data: {email: string; name: string; password: string}) => api.post("/auth/register", data);
export const logout = ()=> api.delete("/auth/logout")
