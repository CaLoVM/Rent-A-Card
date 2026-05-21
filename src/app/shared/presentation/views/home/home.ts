import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RentingStore } from '../../../../renting/application/renting-store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [
    MatGridListModule,
    MatCardModule,
    CommonModule,
    MatError,
    MatProgressSpinner,
    TranslatePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  readonly store = inject(RentingStore);
  protected router = inject(Router);

  displayedColumns: string[] = ['id', 'make', 'actions'];

  vehicleTypes = [
    { name: 'Economy', dailyRevenuePotential: 45.0, estimatedIncidentCost: 250.0 },
    { name: 'SUV', dailyRevenuePotential: 120.0, estimatedIncidentCost: 800.0 },
    { name: 'Luxury', dailyRevenuePotential: 85.0, estimatedIncidentCost: 400.0 },
  ];
}
