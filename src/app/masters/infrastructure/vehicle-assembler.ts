import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehiclesResponse, VehicleResource } from './vehicles-response';

export class VehicleAssembler implements BaseAssembler<
  Vehicle,
  VehicleResource,
  VehiclesResponse
> {
  /**
   * Converts a VehiclesResponse to an array of Vehicle entities.
   * @param response - The API response containing vehicles.
   * @returns An array of Vehicle entities.
   */
  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    return response.vehicles.map((resource) =>
      this.toEntityFromResource(resource as VehicleResource),
    );
  }

  /**
   * Converts a VehicleResource to a Vehicle entity.
   * @param resource - The resource to convert.
   * @returns The converted Vehicle entity.
   */
  toEntityFromResource(resource: VehicleResource): Vehicle {
    return new Vehicle({
      id: resource.id,
      make: resource.make,
      model: resource.model,
      mileageKm: resource.mileageKm,
      dailyRate: resource.dailyRate,
      vehicleType: resource.vehicleType,
      status: resource.status,
    });
  }

  /**
   * Converts a Vehicle entity to a VehicleResource.
   * @param entity - The entity to convert.
   * @returns The converted VehicleResource.
   */
  toResourceFromEntity(entity: Vehicle): VehicleResource {
    return {
      id: entity.id,
      make: entity.make,
      model: entity.model,
      mileageKm: entity.mileageKm,
      dailyRate: entity.dailyRate,
      vehicleType: entity.vehicleType,
      status: entity.status,
    } as VehicleResource;
  }
}
