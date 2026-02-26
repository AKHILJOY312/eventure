import { ContainerModule } from "inversify";
import { TYPES } from "../types";
import { RegisterUser } from "@/application/use-cases/auth/RegisterUser";
import { LoginUser } from "@/application/use-cases/auth/LoginUser";
import { RefreshToken } from "@/application/use-cases/auth/RefreshToken";
import { GetMe } from "@/application/use-cases/auth/GetMe";
import {
  IGetMe,
  ILoginUser,
  IRefreshToken,
  IRegisterUser,
  IVerifyEmail,
} from "@/application/ports/use-cases/auth/interfaces";
import { VerifyEmail } from "@/application/use-cases/auth/VerifyEmail";
import { CreateTask } from "@/application/use-cases/tasks/CreateTask";
import {
  ICreateTask,
  IDeleteTask,
  IGetTaskStats,
  IListTasks,
  IMoveTaskPhase,
  IUpdateTask,
} from "@/application/ports/use-cases/task/interfaces";
import { UpdateTask } from "@/application/use-cases/tasks/UpdateTask";
import { MoveTaskPhase } from "@/application/use-cases/tasks/MoveTaskPhase";
import { DeleteTask } from "@/application/use-cases/tasks/DeleteTask";
import { ListTasks } from "@/application/use-cases/tasks/ListTasks";
import { GetTaskStats } from "@/application/use-cases/tasks/GetTaskStats";

export const useCaseModule = new ContainerModule((options) => {
  // Regular Auth Use Cases
  options.bind<IRegisterUser>(TYPES.RegisterUser).to(RegisterUser);
  options.bind<IVerifyEmail>(TYPES.VerifyEmail).to(VerifyEmail);
  options.bind<ILoginUser>(TYPES.LoginUser).to(LoginUser);
  options.bind<IRefreshToken>(TYPES.RefreshToken).to(RefreshToken);
  options.bind<IGetMe>(TYPES.GetMe).to(GetMe);

  //Tasks
  options.bind<ICreateTask>(TYPES.CreateTask).to(CreateTask);
  options.bind<IUpdateTask>(TYPES.UpdateTask).to(UpdateTask);
  options.bind<IMoveTaskPhase>(TYPES.MoveTaskPhase).to(MoveTaskPhase);
  options.bind<IDeleteTask>(TYPES.DeleteTask).to(DeleteTask);
  options.bind<IListTasks>(TYPES.ListTasks).to(ListTasks);
  options.bind<IGetTaskStats>(TYPES.GetTaskStats).to(GetTaskStats);
});
