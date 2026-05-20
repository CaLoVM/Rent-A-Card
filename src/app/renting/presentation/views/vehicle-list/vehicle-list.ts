import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { RentingStore } from '../../../application/renting-store';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vehicle-list',
  imports: [MatTableModule, MatButtonModule, MatError, MatProgressSpinner],
  templateUrl: './vehicle-list.html',
  styleUrl: './vehicle-list.css',
})
export class VehicleList {
  readonly store = inject(RentingStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'make', 'actions'];

  editVehicle(id: number) {
    this.router.navigate(['renting/vehicles/edit', id]).then();
  }

  deleteVehicle(id: number) {
    this.store.deleteVehicle(id);
  }
}
