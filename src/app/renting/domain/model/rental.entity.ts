import { BaseEntity } from '../../../shared/infrastructure/base-entity';
import { Vehicle } from './vehicle.entity';

export class Rental implements BaseEntity {
  private _id: number;
  private _vehicleId: number;
  private _clientId: number;
  private _startDate: Date;
  private _endDate: Date;
  private _durationsDay: number;
  private _totalCost: number;
  private _status: string;

  private _vehicle: Vehicle | null;

  constructor(rental: {
    id: number;
    vehicleId: number;
    clientId: number;
    startDate: Date;
    endDate: Date;
    durationsDay: number;
    totalCost: number;
    status: string;
    vehicle?: Vehicle | null;
  }) {
    this._id = rental.id;
    this._vehicleId = rental.vehicleId;
    this._clientId = rental.clientId;
    this._startDate = rental.startDate;
    this._endDate = rental.endDate;
    this._durationsDay = rental.durationsDay;
    this._totalCost = rental.totalCost;
    this._status = rental.status;
    this._vehicle = rental.vehicle ?? null;
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
  get clientId(): number {
    return this._clientId;
  }
  set clientId(value: number) {
    this._clientId = value;
  }

  get startDate(): Date {
    return this._startDate;
  }
  set startDate(value: Date) {
    this._startDate = value;
  }
  get endDate(): Date {
    return this._endDate;
  }
  set endDate(value: Date) {
    this._endDate = value;
  }
  get durationsDay(): number {
    return this._durationsDay;
  }
  set durationsDay(value: number) {
    this._durationsDay = value;
  }
  get totalCost(): number {
    return this._totalCost;
  }
  set totalCost(value: number) {
    this._totalCost = value;
  }
  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  /**
   * The vehicle associated with the rental.
   * @remarks
   * This is an object reference to the {@link Vehicle} entity. It may be null if not set.
   */
  get vehicle(): Vehicle | null {
    return this._vehicle;
  }

  /**
   * Sets the vehicle associated with the rental.
   *
   * @param value - The {@link Vehicle} to associate with the rental.
   */
  set vehicle(value: Vehicle | null) {
    this._vehicle = value;
  }
}
