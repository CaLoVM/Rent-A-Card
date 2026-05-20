import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { Rental } from '../domain/model/rental.entity';
import { Incident } from '../domain/model/incident.entity';
import { Vehicle } from '../domain/model/vehicle.entity';
import { HttpClient } from '@angular/common/http';
import { RentalsApiEndpoint } from './rentals-api-endpoint';
import { VehiclesApiEndpoint } from './vehicles-api-endpoint';
import { IncidentsApiEndpoint } from './incidents-api-endpoint';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RentingApi extends BaseApi {
  private readonly rentalsEndpoint: RentalsApiEndpoint;
  private readonly vehiclesEndpoint: VehiclesApiEndpoint;
  private readonly incidentsEndpoint: IncidentsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.rentalsEndpoint = new RentalsApiEndpoint(http);
    this.vehiclesEndpoint = new VehiclesApiEndpoint(http);
    this.incidentsEndpoint = new IncidentsApiEndpoint(http);
  }

  /**
   * Retrieves all rentals from the API.
   * @returns An Observable for an array of Rental objects.
   */
  getRentals(): Observable<Rental[]> {
    return this.rentalsEndpoint.getAll();
  }

  /**
   * Retrieves a single rental by ID.
   * @param id - The ID of the rental.
   * @returns An Observable of the Rental object.
   */
  getRental(id: number): Observable<Rental> {
    return this.rentalsEndpoint.getById(id);
  }

  /**
   * Creates a new rental.
   * @param rental - The rental to create.
   * @returns An Observable of the created Rental object.
   */
  createRental(rental: Rental): Observable<Rental> {
    return this.rentalsEndpoint.create(rental);
  }

  /**
   * Updates an existing rental.
   * @param rental - The rental to update.
   * @returns An Observable of the updated Rental object.
   */
  updateRental(rental: Rental): Observable<Rental> {
    return this.rentalsEndpoint.update(rental, rental.id);
  }

  /**
   * Deletes a rental by ID.
   * @param id - The ID of the rental to delete.
   * @returns An Observable of void.
   */
  deleteRental(id: number): Observable<void> {
    return this.rentalsEndpoint.delete(id);
  }

  /**
   * Retrieves all vehicles from the API.
   * @returns An Observable for an array of Vehicle objects.
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.vehiclesEndpoint.getAll();
  }

  /**
   * Retrieves a single vehicle by ID.
   * @param id - The ID of the vehicle.
   * @returns An Observable of the Vehicle object.
   */
  getVehicle(id: number): Observable<Vehicle> {
    return this.vehiclesEndpoint.getById(id);
  }

  /**
   * Creates a new vehicle.
   * @param vehicle - The vehicle to create.
   * @returns An Observable of the created Vehicle object.
   */
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehiclesEndpoint.create(vehicle);
  }

  /**
   * Updates an existing vehicle.
   * @param vehicle - The vehicle to update.
   * @returns An Observable of the updated Vehicle object.
   */
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehiclesEndpoint.update(vehicle, vehicle.id);
  }

  /**
   * Deletes a vehicle by ID.
   * @param id - The ID of the vehicle to delete.
   * @returns An Observable of void.
   */
  deleteVehicle(id: number): Observable<void> {
    return this.vehiclesEndpoint.delete(id);
  }

  getIncidents(): Observable<Incident[]> {
    return this.incidentsEndpoint.getAll();
  }

  /**
   * Retrieves a single incident by ID.
   * @param id - The ID of the incident.
   * @returns An Observable of the Incident object.
   */
  getIncident(id: number): Observable<Incident> {
    return this.incidentsEndpoint.getById(id);
  }

  /**
   * Creates a new incident.
   * @param incident - The incident to create.
   * @returns An Observable of the created Incident object.
   */
  createIncident(incident: Incident): Observable<Incident> {
    return this.incidentsEndpoint.create(incident);
  }

  /**
   * Updates an existing incident.
   * @param incident - The incident to update.
   * @returns An Observable of the updated Incident object.
   */
  updateIncident(incident: Incident): Observable<Incident> {
    return this.incidentsEndpoint.update(incident, incident.id);
  }

  /**
   * Deletes a incident by ID.
   * @param id - The ID of the incident to delete.
   * @returns An Observable of void.
   */
  deleteIncident(id: number): Observable<void> {
    return this.incidentsEndpoint.delete(id);
  }
}
