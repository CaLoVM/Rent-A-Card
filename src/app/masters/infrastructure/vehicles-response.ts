import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Represents the API response structure for a list of vehicles.
 */
export interface VehiclesResponse extends BaseResponse {
  /**
   * The list of vehicles returned by the API.
   */
  vehicles: VehicleResource[];
}

/**
 * Represents the API resource/DTO for a vehicle.
 */
export interface VehicleResource extends BaseResource {
  id: number;
  make: string;
  model: string;
  mileageKm: number;
  dailyRate: number;
  vehicleType: string;
  status: string;
}
