import api from "./api";

export const listTasks = () => {
  return api.get("/tasks");
};
