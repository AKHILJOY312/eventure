// src/interface-adapters/http/controllers/BookingController.ts
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { HTTP_STATUS } from "../http/constants/httpStatus";
import { BOOKING_MESSAGES } from "@/interface-adapters/http/constants/messages"; // ← create if needed
import { ValidationError } from "@/application/error/AppError";

import {
  createBookingSchema,
  getUserBookingsQuerySchema,
  calculatePriceQuerySchema,
  cancelBookingSchema,
} from "@/interface-adapters/http/validators/bookingValidators";

import {
  ICreateBooking,
  IGetUserBookingHistory,
  ICalculateBookingPrice,
  ICancelBooking,
} from "@/application/ports/use-cases/booking/IBookingUseCase";

@injectable()
export class BookingController {
  constructor(
    @inject(TYPES.CreateBooking)
    private createBookingUC: ICreateBooking,

    @inject(TYPES.GetUserBookingHistory)
    private getUserBookingHistoryUC: IGetUserBookingHistory,

    @inject(TYPES.CalculateBookingPrice)
    private calculateBookingPriceUC: ICalculateBookingPrice,
    @inject(TYPES.CancelBooking) private cancelBookingUC: ICancelBooking,
  ) {}

  // POST /bookings
  createBooking = async (req: Request, res: Response) => {
    const validated = createBookingSchema.safeParse(req.body);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }
    // @ts-expect-error – added by auth middleware (protect)
    const userId = req.user.id;

    const dto = {
      userId,
      serviceId: validated.data.serviceId,
      dates: validated.data.dates.map((d: Date) => d.toISOString()),
    };

    const booking = await this.createBookingUC.execute(dto);

    res.status(HTTP_STATUS.CREATED).json({
      message: BOOKING_MESSAGES.BOOKING_CREATED,
      data: booking,
    });
  };

  // GET /bookings/my-bookings
  getMyBookings = async (req: Request, res: Response) => {
    // @ts-expect-error – added by auth middleware
    const userId = req.user.id;

    const validated = getUserBookingsQuerySchema.safeParse(req.query);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }

    const dto = {
      userId,
      page: validated.data.page,
      limit: validated.data.limit,
      status: validated.data.status,
    };

    const result = await this.getUserBookingHistoryUC.execute(dto);

    res.status(HTTP_STATUS.OK).json(result);
  };

  // GET /bookings/calculate-price
  calculatePrice = async (req: Request, res: Response) => {
    const validated = calculatePriceQuerySchema.safeParse(req.query);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }

    const result = await this.calculateBookingPriceUC.execute(validated.data);

    res.status(HTTP_STATUS.OK).json(result);
  };
  cancelBooking = async (req: Request, res: Response) => {
    const validated = cancelBookingSchema.safeParse(req.body);

    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }
    const { bookingId } = validated.data;
    // @ts-expect-error – added by auth middleware
    const userId = req.user.id;

    const result = await this.cancelBookingUC.execute({ userId, bookingId });
    res.status(HTTP_STATUS.OK).json({
      message: BOOKING_MESSAGES.BOOKING_CANCELLED,
      data: result,
    });
  };
}
