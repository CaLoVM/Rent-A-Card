import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Vehicle } from './vehicle.entity';
import { Rental } from './rental.entity';

export class Incident implements BaseEntity {
  private _id: number;
  private _vehicleId: number;
  private _rentalId: number | null;
  private _incidentType: string;
  private _registeredAt: Date;
  private _estimatedRepairCost: number;
  private _priority: string;

  private _vehicle: Vehicle | null;
  private _rental: Rental | null;

  constructor(incident: {
    id:number;
    vehicleId: number;
    rentalId: number | null;
    incidentType: string;
    registeredAt: Date;
    estimatedRepairCost: number;
    priority: string;
    vehicle?: Vehicle | null;
    rental?: Rental | null;
  }) {
    this._id = incident.id;
    this._vehicleId = incident.vehicleId;
    this._rentalId = incident.rentalId
    this._incidentType = incident.incidentType;
    this._registeredAt = incident.registeredAt
    this._estimatedRepairCost = incident.estimatedRepairCost;
    this._priority = incident.priority;
    this._vehicle = incident.vehicle ?? null;
    this._rental = incident.rental ?? null;
  }
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get vehicleId(): number {
    return this._vehicleId;
  }
  set vehicleId(value: number) {
    this._vehicleId = value;
  }

  get rentalId(): number | null {
    return this._rentalId;
  }
  set rentalId(value: number | null) {
    this._rentalId = value;
  }

  get incidentType(): string {
    return this._incidentType;
  }
  set incidentType(value: string) {
    this._incidentType = value;
  }

  get registeredAt(): Date {
    return this._registeredAt;
  }
  set registeredAt(value: Date) {
    this._registeredAt = value;
  }

  get estimatedRepairCost(): number {
    return this._estimatedRepairCost;
  }
  set estimatedRepairCost(value: number) {
    this._estimatedRepairCost = value;
  }

  get priority(): string {
    return this._priority;
  }
  set priority(value: string) {
    this._priority = value;
  }

  get vehicle(): Vehicle | null {
    return this._vehicle;
  }
  set vehicle(value: Vehicle | null) {
    this._vehicle = value;
  }

  get rental(): Rental | null {
    return this._rental;
  }
  set rental(value: Rental | null) {
    this._rental = value;
  }
}
