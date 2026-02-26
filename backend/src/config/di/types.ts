const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  AccessKeyRepository: Symbol.for("AccessKeyRepository"),
  TaskRepository: Symbol.for("TaskRepository"),

  ProtectMiddleware: Symbol.for("ProtectMiddleware"),
  // Services
  AuthService: Symbol.for("AuthService"),
  EmailService: Symbol.for("EmailService"),

  //controller
  AuthController: Symbol.for("AuthController"),
  TaskController: Symbol.for("TaskController"),

  // Use Cases - Auth
  RegisterUser: Symbol.for("RegisterUser"),
  LoginUser: Symbol.for("LoginUser"),
  LogoutUser: Symbol.for("LogoutUser"),
  RefreshToken: Symbol.for("RefreshToken"),
  VerifyEmail: Symbol.for("VerifyEmail"),
  GetMe: Symbol.for("GetMe"),

  // Use Cases - Tasks
  CreateTask: Symbol.for("CreateTask"),
  ListTasks: Symbol.for("ListTasks"),
  UpdateTask: Symbol.for("UpdateTask"),
  DeleteTask: Symbol.for("DeleteTask"),
  MoveTaskPhase: Symbol.for("MoveTaskPhase"),
  GetTaskStats: Symbol.for("GetTaskStats"),
};

export { TYPES };
