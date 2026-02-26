import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { HTTP_STATUS } from "../../http/constants/httpStatus";
import { AUTH_MESSAGES } from "@/interface-adapters/http/constants/messages";
import {
  ValidationError,
  UnauthorizedError,
} from "@/application/error/AppError";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "@/infra/web/express/utils/cookieUtils";
import {
  registerSchema,
  verifyEmailSchema,
} from "@/interface-adapters/http/validators/userAuthValidators";
import {
  IRegisterUser,
  ILoginUser,
  IRefreshToken,
  IGetMe,
  IVerifyEmail,
} from "@/application/ports/use-cases/auth/interfaces";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.RegisterUser) private registerUC: IRegisterUser,
    @inject(TYPES.VerifyEmail) private verifyEmailUC: IVerifyEmail,
    @inject(TYPES.LoginUser) private loginUC: ILoginUser,
    @inject(TYPES.RefreshToken) private refreshUC: IRefreshToken,
    @inject(TYPES.GetMe) private meUC: IGetMe,
  ) {}

  register = async (req: Request, res: Response) => {
    const validatedData = registerSchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }
    const result = await this.registerUC.execute(validatedData.data);
    res.status(HTTP_STATUS.CREATED).json(result);
  };

  verifyEmail = async (req: Request, res: Response) => {
    const validatedData = verifyEmailSchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }
    const result = await this.verifyEmailUC.execute(validatedData.data);
    res.status(HTTP_STATUS.OK).json(result);
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await this.loginUC.execute(
      email,
      password,
    );

    setRefreshTokenCookie(res, refreshToken);
    res.json({ message: AUTH_MESSAGES.LOGIN_SUCCESS, accessToken, user });
  };

  refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    if (!token) throw new UnauthorizedError(AUTH_MESSAGES.NO_REFRESH_TOKEN);

    const { accessToken } = await this.refreshUC.execute(token);
    res.json({ accessToken });
  };

  logout = async (req: Request, res: Response) => {
    clearRefreshTokenCookie(res);
    res.json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
  };

  me = async (req: Request, res: Response) => {
    // @ts-expect-error – set by protect middleware
    const userId: string = req.user.id;
    const data = await this.meUC.execute(userId);
    res.json(data);
  };
}
