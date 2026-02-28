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
import {
  ICreateService,
  IDeleteService,
  IGetServiceBookings,
  IUpdateService,
} from "@/application/ports/use-cases/admin/IAdminUseCase";
import { CreateService } from "@/application/use-cases/admin/CreateService";
import { DeleteService } from "@/application/use-cases/admin/DeleteService";
import { GetServiceBookings } from "@/application/use-cases/admin/GetServiceBookings";
import { UpdateService } from "@/application/use-cases/admin/UpdateService";
import {
  ICalculateBookingPrice,
  ICreateBooking,
  IGetUserBookingHistory,
} from "@/application/ports/use-cases/booking/IBookingUseCase";
import { CalculateBookingPrice } from "@/application/use-cases/booking/CalculateBookingPrice";
import { CreateBooking } from "@/application/use-cases/booking/CreateBooking";
import { GetUserBookingHistory } from "@/application/use-cases/booking/GetUserBookingHistory";
import {
  IFilterServicesByAvailability,
  IGetServiceDetails,
  ISearchServices,
} from "@/application/ports/use-cases/discover/IDiscoverUseCase";
import { FilterServicesByAvailability } from "@/application/use-cases/discovery/FilterServicesByAvailability";
import { GetServiceDetails } from "@/application/use-cases/discovery/GetServiceDetails";
import { SearchServices } from "@/application/use-cases/discovery/SearchServices";

export const useCaseModule = new ContainerModule((options) => {
  // Regular Auth Use Cases
  options.bind<IRegisterUser>(TYPES.RegisterUser).to(RegisterUser);
  options.bind<IVerifyEmail>(TYPES.VerifyEmail).to(VerifyEmail);
  options.bind<ILoginUser>(TYPES.LoginUser).to(LoginUser);
  options.bind<IRefreshToken>(TYPES.RefreshToken).to(RefreshToken);
  options.bind<IGetMe>(TYPES.GetMe).to(GetMe);

  //admin
  options.bind<ICreateService>(TYPES.CreateService).to(CreateService);
  options.bind<IDeleteService>(TYPES.DeleteService).to(DeleteService);
  options
    .bind<IGetServiceBookings>(TYPES.GetServiceBookings)
    .to(GetServiceBookings);
  options.bind<IUpdateService>(TYPES.UpdateService).to(UpdateService);

  //Booking
  options
    .bind<ICalculateBookingPrice>(TYPES.CalculateBookingPrice)
    .to(CalculateBookingPrice);
  options.bind<ICreateBooking>(TYPES.CreateBooking).to(CreateBooking);
  options
    .bind<IGetUserBookingHistory>(TYPES.GetUserBookingHistory)
    .to(GetUserBookingHistory);

  //Discovery
  options
    .bind<IFilterServicesByAvailability>(TYPES.FilterServicesByAvailability)
    .to(FilterServicesByAvailability);
  options
    .bind<IGetServiceDetails>(TYPES.GetServiceDetails)
    .to(GetServiceDetails);
  options.bind<ISearchServices>(TYPES.SearchServices).to(SearchServices);
});
