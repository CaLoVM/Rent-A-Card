/**

import { computed, Injectable, Signal, signal } from '@angular/core';

import { Vehicle } from '../domain/model/vehicle.entity';
import { MastersApi } from '../infrastructure/masters-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, retry } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MastersStore {

  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);



  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly vehicleCount = computed(() => this.vehicles().length);
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor(private mastersApi: MastersApi) {
    this.loadVehicles();

  }

  private loadVehicles() {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mastersApi
      .getVehicles()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (vehicles) => {
          this.vehiclesSignal.set(vehicles);
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (error) => {
          this.errorSignal.set(this.formatError(error, 'Failed to load vehicles'));
          this.loadingSignal.set(false);
        },
      });
  }





  getVehicleById(id: number): Signal<Vehicle | undefined> {
    return computed(() => (id ? this.vehicles().find((c) => c.id === id) : undefined));
  }



  addVehicle(vehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mastersApi
      .createVehicle(vehicle)
      .pipe(retry(2))
      .subscribe({
        next: (createdVehicle) => {
          this.vehiclesSignal.update((vehicles) => [...vehicles, createdVehicle]);
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(this.formatError(error, 'Failed to create vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }

  updateVehicle(updateVehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mastersApi
      .updateVehicle(updateVehicle)
      .pipe(retry(2))
      .subscribe({
        next: (vehicle) => {
          this.vehiclesSignal.update((vehicles) =>
            vehicles.map((c) => (c.id === vehicle.id ? vehicle : c)),
          );
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(this.formatError(error, 'Failed to update vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }





  deleteVehicle(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.mastersApi
      .deleteVehicle(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.vehiclesSignal.update((vehicles) => vehicles.filter((c) => c.id !== id));
          this.loadingSignal.set(false);
        },
        error: (error) => {
          this.errorSignal.set(this.formatError(error, 'Failed to delete vehicle'));
          this.loadingSignal.set(false);
        },
      });
  }


  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
 */
