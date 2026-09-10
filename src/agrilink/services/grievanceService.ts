import { Grievance, GrievanceCategory, UserRole } from '../types';
import { localStorageService } from './storageService';
import { notificationService } from './notificationService';

export const grievanceService = {
  getAll(): Grievance[] {
    return localStorageService.getGrievances();
  },

  getById(id: string): Grievance | undefined {
    return this.getAll().find(g => g.id === id || g.ticketNumber === id);
  },

  createGrievance(data: {
    transactionId: string;
    transactionNumber: string;
    filedByName: string;
    filedByRole: UserRole;
    category: GrievanceCategory;
    description: string;
    priority?: 'Low' | 'Medium' | 'High';
  }): Grievance {
    const ticketNumber = `GRV-2026-00${Math.floor(200 + Math.random() * 790)}`;
    const newGrievance: Grievance = {
      id: `grv-${Date.now()}`,
      ticketNumber,
      transactionId: data.transactionId,
      transactionNumber: data.transactionNumber,
      filedByName: data.filedByName,
      filedByRole: data.filedByRole,
      category: data.category,
      description: data.description,
      status: 'Under Review',
      priority: data.priority || 'Medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminResponse: 'KrishiSetu Dispute Redressal Cell has acknowledged your ticket. Reviewing transaction logs with escrow partner.'
    };

    const current = this.getAll();
    localStorageService.saveGrievances([newGrievance, ...current]);

    notificationService.notify({
      title: 'Grievance Registered',
      message: `Ticket ${ticketNumber} created under category ${data.category}. Resolution SLA: 24 hours.`,
      type: 'grievance',
      link: '/farmer/grievances'
    });

    return newGrievance;
  },

  resolveGrievance(id: string, responseText: string) {
    const list = this.getAll().map(g => {
      if (g.id === id || g.ticketNumber === id) {
        return {
          ...g,
          status: 'Resolved' as const,
          adminResponse: responseText,
          updatedAt: new Date().toISOString()
        };
      }
      return g;
    });
    localStorageService.saveGrievances(list);
  }
};
