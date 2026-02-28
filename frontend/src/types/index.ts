//-----------------------------------------
//        Auth
//-----------------------------------------

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserModal = User & {
  isBlocked: boolean;
  createdAt: Date | undefined;
  isVerified: boolean;
  status: "active" | "blocked";
  image: string | null;
};

export type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  isAuthenticated: boolean;
};

export type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

//---------------------------------------------------
//Tasks
//---------------------------------------------------

export type TaskStatus = "todo" | "in-progress" | "done";
export type ViewType = "board" | "stats" | "login" | "register";
export type TaskPriority = "low" | "medium" | "high";

export type assignedUser = {
  id: string;
  name: string;
  email: string;
};
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  // priority: TaskPriority;
  // dueDate: string | null;
  createdBy: User;
  createdAt: string;
}

export interface AssignableMember {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: string;
  assignedTo: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}
export interface EditTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}
export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface ListTasksQuery {
  projectId: string;
  status?: TaskStatus;
  assignedToMe?: boolean;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskListResponse {
  tasks: Task[];
}

/* ---------- MEMBERS ---------- */

export interface SearchMembersRequest {
  projectId: string;
  query: string;
}

export interface SearchMembersResponse {
  members: AssignableMember[];
}

/* ---------- ATTACHMENTS ---------- */

export type TaskState = {
  tasks: Task[];
  loading: boolean;
  activeTaskId: string | null;
  activeTask: Task | null;
  error: string | null;
  isManager: boolean;
};

export type DispositionType = "view" | "download" | "task";
