import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Vehicle } from '../domain/model/vehicle.entity';
import { VehiclesResponse, VehicleResource } from './vehicles-response';
import { VehicleAssembler } from './vehicle-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class VehiclesApiEndpoint extends BaseApiEndpoint<
  Vehicle,
  VehicleResource,
  VehiclesResponse,
  VehicleAssembler
> {
  /**
   * Creates an instance of VehiclesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      new VehicleAssembler(),
    );
  }
}
