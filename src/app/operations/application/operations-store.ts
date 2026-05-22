import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { Rental } from '../domain/model/rental.entity';
import { Incident } from '../domain/model/incident.entity';
import { Vehicle } from '../../masters/domain/model/vehicle.entity';
import { OperationsApi } from '../infrastructure/operations-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OperationsStore {
  private readonly rentalsSignal = signal<Rental[]>([]);
  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly incidentsSignal = signal<Incident[]>([]);

  readonly rentals = this.rentalsSignal.asReadonly();
  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly incidents = this.incidentsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly rentalCount = computed(() => this.rentals().length);
  readonly vehicleCount = computed(() => this.vehicles().length);
  readonly incidentCount = computed(() => this.incidents().length);

  constructor(private operationsApi: OperationsApi) {
    this.loadVehicles();
    this.loadRentals();
    this.loadIncidents();
  }

  /**
   * Retrieves a vehicle by its ID as a signal.
   * @param id - The ID of the vehicle.
   * @returns A Signal containing the Vehicle object or undefined if not found.
   */
  getVehicleById(id: number | null | undefined): Signal<Vehicle | undefined> {
    return computed(() => (id ? this.vehicles().find((c) => c.id === id) : undefined));
  }
  getRentalById(id: number | null | undefined): Signal<Rental | undefined> {
    return computed(() => (id ? this.rentals().find((c) => c.id === id) : undefined));
  }

  /**
   * Calculates the total daily rate for rented vehicles of a specific type.
   * @param vehicleType - The type of vehicle to filter by.
   * @returns A Signal containing the total daily rate.
   */
  getTotalRentedDailyRateByVehicleType(vehicleType: string): Signal<number> {
    return computed(() =>
      this.vehicles()
        .filter((v) => v.status === 'RENTED' && v.vehicleType === vehicleType)
        .reduce((acc, v) => acc + v.dailyRate, 0),
    );
  }

  /**
   * Gets the count of rented vehicles of a specific type.
   * @param vehicleType - The type of vehicle to filter by.
   * @returns A Signal containing the count of rented vehicles.
   */
  getRentedVehicleCountByType(vehicleType: string): Signal<number> {
    return computed(
      () =>
        this.vehicles().filter((v) => v.status === 'RENTED' && v.vehicleType === vehicleType)
          .length,
    );
  }

  /**
   * Calculates the weighted sum of estimated repair costs for incidents, filtered by vehicle type.
   * Weight: HIGH = 2.0, NORMAL = 1.0. Rounded to 2 decimal places.
   * @param vehicleType - The type of vehicle to filter by.
   * @returns A Signal containing the total weighted cost.
   */
  getWeightedRepairCostByVehicleType(vehicleType: string): Signal<number> {
    return computed(() => {
      const total = this.incidents()
        .filter((incident) => {
          const vehicle = this.vehicles().find((v) => v.id === incident.vehicleId);
          return vehicle?.vehicleType === vehicleType;
        })
        .reduce((acc, incident) => {
          const weight = incident.priority === 'HIGH' ? 2.0 : 1.0;
          return acc + incident.estimatedRepairCost * weight;
        }, 0);
      return Math.round(total * 100) / 100;
    });
  }

  /**
   * Gets the most recent incident with 'NORMAL' priority.
   * @returns A Signal containing the most recent normal incident or undefined.
   */
  getMostRecentNormalIncident(): Signal<Incident | undefined> {
    return computed(() => {
      const normalIncidents = this.incidents().filter((i) => i.priority === 'NORMAL');
      if (normalIncidents.length === 0) return undefined;

      return normalIncidents.reduce((latest, current) => {
        const latestDate = new Date(latest.registeredAt).getTime();
        const currentDate = new Date(current.registeredAt).getTime();
        return currentDate > latestDate ? current : latest;
      });
    });
  }

  /**
   * Adds a new rental.
   * @param rental - The rental to add.
   */
  addRental(rental: Rental): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .createRental(rental)
      .pipe(retry(2))
      .subscribe({
        next: (createdRental) => {
          this.assignVehicleToRental(createdRental);
          this.rentalsSignal.update((rentals) => [...rentals, createdRental]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create rental'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Updates an existing rental.
   * @param updatedRental - The rental to update.
   */
  updateRental(updatedRental: Rental): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .updateRental(updatedRental)
      .pipe(retry(2))
      .subscribe({
        next: (rental) => {
          //this.assignVehicleToRental(rental);
          this.rentalsSignal.update((rentals) =>
            rentals.map((c) => (c.id === rental.id ? rental : c)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update rental'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Deletes a rental by ID.
   * @param id - The ID of the rental to delete.
   */
  deleteRental(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .deleteRental(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.rentalsSignal.update((rentals) => rentals.filter((c) => c.id !== id));
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete rental'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Adds a new vehicle.
   * @param vehicle - The vehicle to add.
   */
  addVehicle(vehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .createVehicle(vehicle)
      .pipe(retry(2))
      .subscribe({
        next: (createdVehicle) => {
          this.vehiclesSignal.update((vehicles) => [...vehicles, createdVehicle]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Updates an existing vehicle.
   * @param updatedVehicle - The vehicle to update.
   */
  updateVehicle(updatedVehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .updateVehicle(updatedVehicle)
      .pipe(retry(2))
      .subscribe({
        next: (vehicle) => {
          this.vehiclesSignal.update((vehicles) =>
            vehicles.map((c) => (c.id === vehicle.id ? vehicle : c)),
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Deletes a vehicle by ID.
   * @param id - The ID of the vehicle to delete.
   */
  deleteVehicle(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .deleteVehicle(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.vehiclesSignal.update((vehicles) => vehicles.filter((c) => c.id !== id));
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Adds a new incident.
   * @param incident - The incident to add.
   */
  addIncident(incident: Incident): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .createIncident(incident)
      .pipe(retry(2))
      .subscribe({
        next: (createdIncident) => {
          this.assignVehicleToIncident(createdIncident);
          this.incidentsSignal.update((incidents) => [...incidents, createdIncident]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create incident'));
          this.loadingSignal.set(false);
        },
      });
  }

  private assignVehicleToRental(rental: Rental): Rental {
    const vehicleId = rental.vehicleId ?? 0;
    rental.vehicle = vehicleId ? (this.getVehicleById(vehicleId)() ?? null) : null;
    return rental;
  }

  private assignVehicleToIncident(incident: Incident): Incident {
    const vehicleId = incident.vehicleId ?? 0;
    incident.vehicle = vehicleId ? (this.getVehicleById(vehicleId)() ?? null) : null;
    return incident;
  }

  private assignVehiclesToRentals(): void {
    this.rentalsSignal.update((rentals) =>
      rentals.map((rental) => this.assignVehicleToRental(rental)),
    );
  }

  private assignVehiclesToIncidents(): void {
    this.incidentsSignal.update((incidents) =>
      incidents.map((incident) => this.assignVehicleToIncident(incident)),
    );
  }

  /**
   * Loads all rentals from the API.
   */
  private loadRentals(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .getRentals()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (rentals) => {
          console.log(rentals);
          this.rentalsSignal.set(rentals);
          this.loadingSignal.set(false);
          this.assignVehiclesToRentals();
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load rentals'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all incidents from the API.
   */
  private loadIncidents(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .getIncidents()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (incidents) => {
          this.incidentsSignal.set(incidents);
          this.loadingSignal.set(false);
          this.assignVehiclesToIncidents();
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load incidents'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Loads all vehicles from the API.

   */
  private loadVehicles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.operationsApi
      .getVehicles()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (vehicles) => {
          this.vehiclesSignal.set(vehicles);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load vehicles'));
          this.loadingSignal.set(false);
        },
      });
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
