const TYPES = {
  // Repositories
  UserRepository: Symbol.for("UserRepository"),
  OtpRepository: Symbol.for("OtpRepository"),
  BookingRepository: Symbol.for("BookingRepository"),
  ServiceRepository: Symbol.for("ServiceRepository"),

  //middlewares
  ProtectMiddleware: Symbol.for("ProtectMiddleware"),
  // Services
  AuthService: Symbol.for("AuthService"),
  EmailService: Symbol.for("EmailService"),

  //controller
  AuthController: Symbol.for("AuthController"),
  AdminController: Symbol.for("AdminController"),
  BookingController: Symbol.for("BookingController"),
  DiscoverController: Symbol.for("DiscoverController"),

  // Use Cases - Auth
  RegisterUser: Symbol.for("RegisterUser"),
  LoginUser: Symbol.for("LoginUser"),
  LogoutUser: Symbol.for("LogoutUser"),
  RefreshToken: Symbol.for("RefreshToken"),
  VerifyEmail: Symbol.for("VerifyEmail"),
  GetMe: Symbol.for("GetMe"),

  //admin
  CreateService: Symbol.for("CreateService"),
  DeleteService: Symbol.for("DeleteService"),
  GetServiceBookings: Symbol.for("GetServiceBookings"),
  UpdateService: Symbol.for("UpdateService"),
  ListServices: Symbol.for("ListServices"),
  UpdateBookingStatus: Symbol.for("UpdateBookingStatus"),

  //Booking
  CalculateBookingPrice: Symbol.for("CalculateBookingPrice"),
  CreateBooking: Symbol.for("CreateBooking"),
  GetUserBookingHistory: Symbol.for("GetUserBookingHistory"),
  CancelBooking: Symbol.for("CancelBooking"),
  //Discovery
  SearchServices: Symbol.for("SearchServices"),
  FilterServicesByAvailability: Symbol.for("FilterServicesByAvailability"),
  GetServiceDetails: Symbol.for("GetServiceDetails"),
};

export { TYPES };
