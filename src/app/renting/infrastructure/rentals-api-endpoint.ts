import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Rental } from '../domain/model/rental.entity';
import { RentalResource, RentalsResponse } from './rentals-response';
import { RentalAssembler } from './rental-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class RentalsApiEndpoint extends BaseApiEndpoint<
  Rental,
  RentalResource,
  RentalsResponse,
  RentalAssembler
> {
  /**
   * Creates an instance of RentalsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderRentalsEndpointPath}`,
      new RentalAssembler(),
    );
  }
}
