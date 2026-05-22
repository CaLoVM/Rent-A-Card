import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationsStore } from '../../../application/operations-store';
import { Rental } from '../../../domain/model/rental.entity';
import { Incident } from '../../../domain/model/incident.entity';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rental-form',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslatePipe,
  ],
  templateUrl: './rental-form.html',
  styleUrl: './rental-form.css',
})
export class RentalForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(OperationsStore);
  private snackBar = inject(MatSnackBar);

  form = this.fb.group({
    vehicleId: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    clientId: new FormControl<number | null>(null),
    durationDays: new FormControl<number | null>(null),
  });
  vehicles = this.store.vehicles;
  rentals = this.store.rentals;
  isEdit = false;
  rentalId: number | null = null;

  constructor() {
    this.route.params.subscribe((params) => {
      this.rentalId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.rentalId;
      if (this.isEdit) {
        const rental = this.store.getRentalById(this.rentalId)();
        if (rental) {
          this.form.patchValue({
            vehicleId: rental.vehicleId,
            clientId: rental.clientId,
            durationDays: rental.durationDays,
          });
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  submit() {
    if (this.form.invalid) return;

    const durationDays = Number(this.form.value.durationDays ?? 0);
    const vehicleId = this.form.value.vehicleId!;


    if (!this.isEdit) {
      const activeRental = this.store
        .rentals()
        .find((r) => r.vehicleId === vehicleId && r.status === 'ACTIVE');
      if (activeRental) {
        this.snackBar.open('This vehicle already has an ACTIVE rental.', 'Close', {
          duration: 3000,
        });
        return;
      }
    }

    const vehicle = this.store.getVehicleById(vehicleId)();

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + durationDays);

    const totalCost = (vehicle?.dailyRate ?? 0) * durationDays;

    const rental: Rental = new Rental({
      id: this.rentalId ?? 0,
      vehicleId: vehicleId,
      clientId: Number(this.form.value.clientId ?? 0),
      durationDays: durationDays,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      totalCost: totalCost,
      status: 'ACTIVE',
    });

    if (this.isEdit) {
      this.store.updateRental(rental);
      this.snackBar.open('Rental updated successfully', 'Close', { duration: 3000 });
    } else {
      this.store.addRental(rental);

      // Requisito: Generar automáticamente un registro en Incidents de tipo "CLEANING"
      const cleaningIncident = new Incident({
        id: 0,
        vehicleId: vehicleId,
        rentalId: 0,
        incidentType: 'CLEANING',
        registeredAt: new Date(),
        estimatedRepairCost: 50.0,
        priority: 'NORMAL',
      });
      this.store.addIncident(cleaningIncident);

      this.snackBar.open('Rental and cleaning order created successfully', 'Close', {
        duration: 3000,
      });
    }

    this.router.navigate(['/home']).then();
  }
}
