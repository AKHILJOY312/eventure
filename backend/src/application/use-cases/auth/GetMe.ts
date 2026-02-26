// src/application/use-cases/auth/GetMe.ts
import { injectable, inject } from "inversify";
import { TYPES } from "@/config/di/types";

import { GetMeResponseDTO } from "@/application/dto/authDtos";
import { NotFoundError, UnauthorizedError } from "@/application/error/AppError";
import { IGetMe } from "@/application/ports/use-cases/auth/interfaces";
import { IUserRepository } from "@/application/ports/repositories/IUserRepository";

@injectable()
export class GetMe implements IGetMe {
  constructor(
    @inject(TYPES.UserRepository) private userRepo: IUserRepository,
  ) {}

  async execute(userId: string): Promise<GetMeResponseDTO> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError("USER_NOT_FOUND");
    }

    if (!user.isVerified) {
      throw new UnauthorizedError("ACCOUNT_VERIFICATION_REQUIRED");
    }

    return {
      user: {
        id: user.id!,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt || new Date(),
      },
    };
  }
}
