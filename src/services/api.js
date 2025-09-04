import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const getWorkflows = () => api.get("/metadata/workflow");
export const createWorkflow = (data) => api.post("/metadata/workflow", data);
export const updateWorkflow = (data) => api.put("/metadata/workflow", data);
