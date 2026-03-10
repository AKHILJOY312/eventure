import { UpdateService } from "./UpdateService";
import { Service, ServiceCategory } from "@/entities/Service";
import { IServiceRepository } from "@/application/ports/repositories/IServiceRepository";

describe("UpdateService (unit)", () => {
  it("updates only provided fields and keeps untouched values", async () => {
    const existingService = new Service({
      id: "65f0b9b3f4d0f0f0f0f0f0f0",
      title: "Classic Venue",
      category: ServiceCategory.Venue,
      pricePerDay: 5000,
      location: "Ernakulam",
      description: "Old description",
      adminId: "65f0b9b3f4d0f0f0f0f0f0f1",
      availableDates: [],
      bookedDates: [],
    });

    const repo: Pick<IServiceRepository, "findByIdAndAdmin" | "update"> = {
      findByIdAndAdmin: jest.fn().mockResolvedValue(existingService),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new UpdateService(repo as IServiceRepository);

    const result = await useCase.execute({
      serviceId: existingService.id!,
      adminId: existingService.adminId,
      title: "Updated Venue",
    });

    expect(repo.findByIdAndAdmin).toHaveBeenCalledWith(
      existingService.id,
      existingService.adminId,
    );
    expect(repo.update).toHaveBeenCalledTimes(1);
    expect(result.title).toBe("Updated Venue");
    expect(result.location).toBe("Ernakulam");
    expect(result.description).toBe("Old description");
  });
});
