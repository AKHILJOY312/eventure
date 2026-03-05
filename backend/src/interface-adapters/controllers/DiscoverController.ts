import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "@/config/di/types";
import { HTTP_STATUS } from "../http/constants/httpStatus";
import { ValidationError } from "@/application/error/AppError";

import {
  ISearchServices,
  IFilterServicesByAvailability,
  IGetServiceDetails,
} from "@/application/ports/use-cases/discover/IDiscoverUseCase";

import {
  searchServicesSchema,
  filterAvailabilitySchema,
  getServiceDetailsSchema,
} from "@/interface-adapters/http/validators/discoverValidators";

@injectable()
export class DiscoverController {
  constructor(
    @inject(TYPES.SearchServices)
    private searchUC: ISearchServices,

    @inject(TYPES.FilterServicesByAvailability)
    private filterUC: IFilterServicesByAvailability,

    @inject(TYPES.GetServiceDetails)
    private detailsUC: IGetServiceDetails,
  ) {}

  search = async (req: Request, res: Response) => {
    const validated = searchServicesSchema.safeParse(req.query);
    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }

    const result = await this.searchUC.execute(validated.data);
    res.status(HTTP_STATUS.OK).json(result);
  };

  filterByAvailability = async (req: Request, res: Response) => {
    const validated = filterAvailabilitySchema.safeParse(req.query);
    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }

    const result = await this.filterUC.execute(validated.data);
    res.status(HTTP_STATUS.OK).json(result);
  };

  getServiceDetails = async (req: Request, res: Response) => {
    const validated = getServiceDetailsSchema.safeParse(req.params);
    if (!validated.success) {
      throw new ValidationError(validated.error.issues[0].message);
    }

    const result = await this.detailsUC.execute(validated.data);
    res.status(HTTP_STATUS.OK).json(result);
  };
}
