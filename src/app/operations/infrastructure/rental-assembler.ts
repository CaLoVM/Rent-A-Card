import { RentalResource, RentalsResponse } from './rentals-response';
import { Rental } from '../domain/model/rental.entity';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';

export class RentalAssembler implements BaseAssembler<Rental, RentalResource, RentalsResponse> {
  /**
   * Converts a RentalsResponse to an array of Rental entities.
   * @param response - The API response containing rentals.
   * @returns An array of Rental entities.
   */
  toEntitiesFromResponse(response: RentalsResponse): Rental[] {
    console.log(response);
    return response.rentals.map((resource) =>
      this.toEntityFromResource(resource as RentalResource),
    );
  }

  /**
   * Converts a RentalResource to a Rental entity.
   * @param resource - The resource to convert.
   * @returns The converted Rental entity.
   */
  toEntityFromResource(resource: RentalResource): Rental {
    return new Rental({
      id: resource.id,
      vehicleId: resource.vehicleId,
      clientId: resource.clientId,
      startDate: resource.startDate,
      endDate: resource.endDate,
      durationDays: resource.durationDays,
      totalCost: resource.totalCost,
      status: resource.status,
    });
  }

  /**
   * Converts a Rental entity to a RentalResource.
   * @param entity - The entity to convert.
   * @returns The converted RentalResource.
   */
  toResourceFromEntity(entity: Rental): RentalResource {
    return {
      id: entity.id,
      vehicleId: entity.vehicleId,
      clientId: entity.clientId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      durationDays: entity.durationDays,
      totalCost: entity.totalCost,
      status: entity.status,
    } as RentalResource;
  }
}
