import { Injectable } from '@angular/core';
import { computed, Signal, signal } from '@angular/core';
import { Rental } from '../domain/model/rental.entity';
import { Vehicle } from '../domain/model/vehicle.entity';
import { RentingApi } from '../infrastructure/renting-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RentingStore {
  private readonly rentalsSignal = signal<Rental[]>([]);
  private readonly vehiclesSignal = signal<Vehicle[]>([]);

  readonly rentals = this.rentalsSignal.asReadonly();
  readonly vehicles = this.vehiclesSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly rentalCount = computed(() => this.rentals().length);
  readonly vehicleCount = computed(() => this.vehicles().length);

  constructor(private rentingApi: RentingApi) {
    this.loadVehicles();
    this.loadRentals();
  }

  /**
   * Retrieves a vehicle by its ID as a signal.
   * @param id - The ID of the vehicle.
   * @returns A Signal containing the Vehicle object or undefined if not found.
   */
  getVehicleById(id: number | null | undefined): Signal<Vehicle | undefined> {
    return computed(() => (id ? this.vehicles().find((c) => c.id === id) : undefined));
  }

  /**
   * Adds a new rental.
   * @param rental - The rental to add.
   */
  addRental(rental: Rental): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rentingApi
      .createRental(rental)
      .pipe(retry(2))
      .subscribe({
        next: (createdRental) => {
          //this.assignVehicleToRental(createdRental);
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
    this.rentingApi
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
    this.rentingApi
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
    this.rentingApi
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
    this.rentingApi
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
    this.rentingApi
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
   * Loads all rentals from the API.
   */
  private loadRentals(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.rentingApi
      .getRentals()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (rentals) => {
          console.log(rentals);
          this.rentalsSignal.set(rentals);
          this.loadingSignal.set(false);
          //this.assignVehiclesToRentals();
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load rentals'));
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
    this.rentingApi
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

  //CalculateDailyRevenuePotential(vehicleType: string){
  //  const dailyRevenuePotential :number = 0;

  //}

  calculateRentedDailyRateByType(vehicles: Vehicle[]): Record<string, number> {
    return vehicles
      // 1. Filtramos solo los que tienen status "RENTED"
      .filter(vehicle => vehicle.status === 'RENTED')
      // 2. Agrupamos y sumamos el dailyRate
      .reduce((acc, vehicle) => {
        const type = vehicle.vehicleType;

        // Si el tipo de vehículo aún no existe en nuestro acumulador, lo inicializamos en 0
        if (!acc[type]) {
          acc[type] = 0;
        }

        // Sumamos el dailyRate al tipo correspondiente
        acc[type] += vehicle.dailyRate;

        return acc;
      }, {} as Record<string, number>);
  }
  /**
  private assignVehiclesToRentals(): void {
    this.rentalsSignal.update((rentals) =>
      rentals.map((rental) => this.assignVehicleToRental(rental)),
    );
  }

  private assignVehicleToRental(rental: Rental): Rental {
    const vehicleId = rental.vehicleId ?? 0;
    const vehicle = vehicleId
      ? (this.vehicles().find((cat) => cat.id === vehicleId) ?? null)
      : null;
    return { ...rental, vehicle } as Rental;
  }
   */

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
