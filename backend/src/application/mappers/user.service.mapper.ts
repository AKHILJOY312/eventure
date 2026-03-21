// service.mapper.ts

import { Service } from "@/entities/Service";
import { ServiceResponseDTO } from "@/application/dto/discover.dtos";

export const toServiceResponseDTO = (service: Service): ServiceResponseDTO => ({
  id: service.id!,
  title: service.title,
  category: service.category,
  pricePerDay: service.pricePerDay,
  description: service.description,
  location: service.location,
  contactDetails: service.contactDetails,
  imageUrl: service.imageUrl,
  adminId: service.adminId,
  availableDates: service.availableDates,
  bookedDates: service.bookedDates,
  createdAt: service.createdAt,
  updatedAt: service.updatedAt,
});
