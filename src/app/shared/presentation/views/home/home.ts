import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OperationsStore } from '../../../../operations/application/operations-store';
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
  readonly store = inject(OperationsStore);
  protected router = inject(Router);


  totalEconomyDailyRate = this.store.getTotalRentedDailyRateByVehicleType('ECONOMY');
  totalEconomyWeightedRepairCost = this.store.getWeightedRepairCostByVehicleType('ECONOMY');
  totalEconomyRentedCount = this.store.getRentedVehicleCountByType('ECONOMY');
  totalSuvDailyRate = this.store.getTotalRentedDailyRateByVehicleType('SUV');
  totalSuvWeightedRepairCost = this.store.getWeightedRepairCostByVehicleType('SUV');
  totalSuvRentedCount = this.store.getRentedVehicleCountByType('SUV');
  totalLuxuryDailyRate = this.store.getTotalRentedDailyRateByVehicleType('LUXURY');
  totalLuxuryWeightedRepairCost = this.store.getWeightedRepairCostByVehicleType('LUXURY');
  totalLuxuryRentedCount = this.store.getRentedVehicleCountByType('LUXURY');

  mostRecentNormalIncident = this.store.getMostRecentNormalIncident();

}
