import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { HTTP_STATUS } from "../http/constants/httpStatus";
import { ValidationError } from "@/application/error/AppError";
import {
  createServiceSchema,
  updateServiceSchema,
  getBookingsSchema,
  listAdminServicesSchema,
  updateBookingStatusSchema,
  updateBookingStatusParamsSchema,
} from "@/interface-adapters/http/validators/adminValidators";
import {
  ICreateService,
  IUpdateService,
  IDeleteService,
  IGetServiceBookings,
  IListAllServices,
  IUpdateBookingStatus,
} from "@/application/ports/use-cases/admin/IAdminUseCase";

@injectable()
export class AdminController {
  constructor(
    @inject(TYPES.CreateService) private createServiceUC: ICreateService,
    @inject(TYPES.UpdateService) private updateServiceUC: IUpdateService,
    @inject(TYPES.DeleteService) private deleteServiceUC: IDeleteService,
    @inject(TYPES.GetServiceBookings)
    private getBookingsUC: IGetServiceBookings,
    @inject(TYPES.ListServices)
    private listAdminServicesUC: IListAllServices,
    @inject(TYPES.UpdateBookingStatus)
    private updateBookingStatusUC: IUpdateBookingStatus,
  ) {}

  createService = async (req: Request, res: Response) => {
    const validatedData = createServiceSchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    // @ts-expect-error – adminId set by auth/role middleware
    const adminId = req.user.id;

    const result = await this.createServiceUC.execute({
      ...validatedData.data,
      adminId,
    });

    res.status(HTTP_STATUS.CREATED).json(result);
  };

  updateService = async (req: Request, res: Response) => {
    const validatedData = updateServiceSchema.safeParse(req.body);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    const { serviceId } = req.params;
    // @ts-expect-error – adminId set by auth/role middleware
    const adminId = req.user.id;

    const result = await this.updateServiceUC.execute({
      ...validatedData.data,
      serviceId,
      adminId,
    });

    res.status(HTTP_STATUS.OK).json(result);
  };

  deleteService = async (req: Request, res: Response) => {
    const { serviceId } = req.params;
    // @ts-expect-error – adminId set by auth/role middleware
    const adminId = req.user.id;

    const result = await this.deleteServiceUC.execute({
      serviceId,
      adminId,
    });

    res.status(HTTP_STATUS.OK).json(result);
  };

  getServiceBookings = async (req: Request, res: Response) => {
    // Combine query params for validation
    const validatedData = getBookingsSchema.safeParse(req.query);
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    const { serviceId } = req.params;
    // @ts-expect-error – adminId set by auth/role middleware
    const adminId = req.user.id;

    const result = await this.getBookingsUC.execute({
      ...validatedData.data,
      serviceId,
      adminId,
    });

    res.status(HTTP_STATUS.OK).json(result);
  };

  listAdminServices = async (req: Request, res: Response) => {
    const validatedData = listAdminServicesSchema.safeParse(req.query);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.issues[0].message);
    }

    // @ts-expect-error – adminId set by auth middleware
    const adminId = req.user.id;

    const result = await this.listAdminServicesUC.execute({
      adminId,
      ...validatedData.data,
    });

    res.status(HTTP_STATUS.OK).json(result);
  };

  updateBookingStatus = async (req: Request, res: Response) => {
    const validatedBody = updateBookingStatusSchema.safeParse(req.body);
    if (!validatedBody.success) {
      throw new ValidationError(validatedBody.error.issues[0].message);
    }

    const validatedParams = updateBookingStatusParamsSchema.safeParse(
      req.params,
    );
    if (!validatedParams.success) {
      throw new ValidationError(validatedParams.error.issues[0].message);
    }

    // @ts-expect-error - adminId set by auth middleware
    const adminId = req.user.id;

    const result = await this.updateBookingStatusUC.execute({
      adminId,
      serviceId: validatedParams.data.serviceId,
      bookingId: validatedParams.data.bookingId,
      status: validatedBody.data.status,
    });

    res.status(HTTP_STATUS.OK).json(result);
  };
}
