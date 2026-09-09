import { LogisticsVehicle, LogisticsBooking } from '../types';
import { DEMO_VEHICLES } from '../data/mockData';

const LOCAL_STORAGE_BOOKINGS = 'smartagrilink_logistics_bookings';

export const logisticsService = {
  getAvailableVehicles(): LogisticsVehicle[] {
    return DEMO_VEHICLES;
  },

  calculateFreightCost(vehicleId: string, distanceKm: number): number {
    const vehicle = DEMO_VEHICLES.find(v => v.id === vehicleId) || DEMO_VEHICLES[0];
    return Math.round(vehicle.baseFare + (distanceKm * vehicle.perKmRate));
  },

  getBookings(): LogisticsBooking[] {
    const data = localStorage.getItem(LOCAL_STORAGE_BOOKINGS);
    return data ? JSON.parse(data) : [
      {
        id: 'bk-log-01',
        bookingNumber: 'LOG-2026-00341',
        lotId: 'lot-tom-00421',
        farmerId: 'farmer-ramesh',
        vehicleId: 'veh-pickup-02',
        vehicleName: 'Mahindra Bolero Maxi Truck Plus',
        pickupLocation: 'Bhimavaram Farm-Gate',
        dropLocation: 'Tadepalligudem Food Park',
        distanceKm: 28,
        totalEstimatedCost: 1996,
        scheduledDate: 'Today, 11:30 AM',
        status: 'Vehicle Dispatched',
        driverName: 'Nageswara Rao',
        driverPhone: '+91 94401 77890'
      }
    ];
  },

  createBooking(data: {
    lotId: string;
    farmerId: string;
    vehicleId: string;
    pickupLocation: string;
    dropLocation: string;
    distanceKm: number;
    scheduledDate: string;
  }): LogisticsBooking {
    const vehicle = DEMO_VEHICLES.find(v => v.id === data.vehicleId) || DEMO_VEHICLES[0];
    const cost = this.calculateFreightCost(data.vehicleId, data.distanceKm);

    const booking: LogisticsBooking = {
      id: `bk-${Date.now()}`,
      bookingNumber: `LOG-2026-00${Math.floor(400 + Math.random() * 500)}`,
      lotId: data.lotId,
      farmerId: data.farmerId,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      pickupLocation: data.pickupLocation,
      dropLocation: data.dropLocation,
      distanceKm: data.distanceKm,
      totalEstimatedCost: cost,
      scheduledDate: data.scheduledDate,
      status: 'Scheduled',
      driverName: vehicle.driverName,
      driverPhone: vehicle.driverPhone
    };

    const list = [booking, ...this.getBookings()];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS, JSON.stringify(list));
    return booking;
  }
};
