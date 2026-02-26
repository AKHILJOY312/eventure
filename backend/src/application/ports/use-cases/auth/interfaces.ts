import {
  LoginUserResponseDTO,
  GetMeResponseDTO,
  RegisterUserDto,
  VerifyEmailDto,
} from "@/application/dto/authDtos";

export interface IRegisterUser {
  execute(dto: RegisterUserDto): Promise<{ message: string }>;
}

export interface IVerifyEmail {
  execute(dto: VerifyEmailDto): Promise<{ message: string }>;
}

export interface ILoginUser {
  execute(email: string, password: string): Promise<LoginUserResponseDTO>;
}

export interface IGetMe {
  execute(userId: string): Promise<GetMeResponseDTO>;
}

export interface ILogoutUser {
  execute(refreshToken: string): Promise<{ message: string }>;
}

export interface IRefreshToken {
  execute(refreshToken: string): Promise<{ accessToken: string }>;
}
