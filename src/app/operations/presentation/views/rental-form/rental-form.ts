import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationsStore } from '../../../application/operations-store';
import { Rental } from '../../../domain/model/rental.entity';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

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

    const rental: Rental = new Rental({
      id: this.rentalId ?? 0,
      vehicleId: this.form.value.vehicleId!,
      clientId: Number(this.form.value.clientId ?? 0),
      durationDays: Number(this.form.value.durationDays ?? 0),
      startDate: '',
      endDate: '',
      totalCost: 0.0,
      status: 'ACTIVE',
    });

    if (this.isEdit) {
      this.store.updateRental(rental);
    } else {
      this.store.addRental(rental);
    }

    this.router.navigate(['/home']).then();
  }
}
