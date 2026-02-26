// // src/application/use-cases/auth/LogoutUser.ts
// import { injectable, inject } from "inversify";
// import { TYPES } from "@/config/di/types";
// import { ILogoutUser } from "@/application/ports/use-cases/auth/IAuthUseCases";
// import { IAuthService } from "@/application/ports/services/IAuthService";

// @injectable()
// export class LogoutUser implements ILogoutUser {
//   constructor(@inject(TYPES.AuthService) private auth: IAuthService) {}

//   async execute(refreshToken: string): Promise<{ message: string }> {
//     // Implementation depends on your strategy:
//     // 1. If using a whitelist/blacklist in Redis:
//     // await this.auth.blacklistToken(refreshToken);

//     // 2. Simple response for frontend to clear local storage:
//     return { message: "LOGOUT_SUCCESSFUL_SESSION_TERMINATED" };
//   }
// }
