// src/application/dto/authDtos.ts

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

export interface LoginUserResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDTO;
}

export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessKey: string; // The 6-digit unique registration string
}

export interface VerifyEmailDto {
  email: string;
  otp: string; // The 6-digit numeric code
}

export interface GetMeResponseDTO {
  user: AuthUserDTO & {
    createdAt: Date;
  };
}
