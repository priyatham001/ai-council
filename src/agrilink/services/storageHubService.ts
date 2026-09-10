import { StorageWarehouse, StorageBooking } from '../types';
import { DEMO_WAREHOUSES } from '../data/mockData';

const LOCAL_STORAGE_STORAGE_BOOKINGS = 'smartagrilink_storage_bookings';

export const storageHubService = {
  getWarehouses(): StorageWarehouse[] {
    return DEMO_WAREHOUSES;
  },

  calculateStorageCost(warehouseId: string, quantityQuintals: number, days: number): number {
    const warehouse = DEMO_WAREHOUSES.find(w => w.id === warehouseId) || DEMO_WAREHOUSES[0];
    return Math.round(quantityQuintals * warehouse.pricePerDayPerQuintal * days);
  },

  getBookings(): StorageBooking[] {
    const data = localStorage.getItem(LOCAL_STORAGE_STORAGE_BOOKINGS);
    return data ? JSON.parse(data) : [
      {
        id: 'st-bk-01',
        bookingNumber: 'STR-2026-00120',
        warehouseId: 'wh-godavari-cold',
        warehouseName: 'Godavari Agri Cold Storage & Warehouse',
        farmerId: 'farmer-ramesh',
        crop: 'Tomato',
        quantityQuintals: 40,
        startDate: 'Sep 07, 2026',
        estimatedDays: 4,
        totalEstimatedCost: 720,
        status: 'Active'
      }
    ];
  },

  createBooking(data: {
    warehouseId: string;
    farmerId: string;
    crop: string;
    quantityQuintals: number;
    startDate: string;
    estimatedDays: number;
  }): StorageBooking {
    const wh = DEMO_WAREHOUSES.find(w => w.id === data.warehouseId) || DEMO_WAREHOUSES[0];
    const totalCost = this.calculateStorageCost(data.warehouseId, data.quantityQuintals, data.estimatedDays);

    const booking: StorageBooking = {
      id: `st-bk-${Date.now()}`,
      bookingNumber: `STR-2026-00${Math.floor(200 + Math.random() * 700)}`,
      warehouseId: wh.id,
      warehouseName: wh.name,
      farmerId: data.farmerId,
      crop: data.crop,
      quantityQuintals: data.quantityQuintals,
      startDate: data.startDate,
      estimatedDays: data.estimatedDays,
      totalEstimatedCost: totalCost,
      status: 'Confirmed'
    };

    const list = [booking, ...this.getBookings()];
    localStorage.setItem(LOCAL_STORAGE_STORAGE_BOOKINGS, JSON.stringify(list));
    return booking;
  }
};
