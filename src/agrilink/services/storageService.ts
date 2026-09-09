import {
  DigitalLot,
  BuyerOffer,
  Transaction,
  Grievance,
  NotificationItem,
  UserRole,
  Language,
  BuyerDemandRequirement,
  FarmerPersona
} from '../types';
import {
  DEMO_LOTS,
  DEMO_OFFERS,
  DEMO_TRANSACTIONS,
  DEMO_GRIEVANCES,
  DEMO_NOTIFICATIONS,
  DEMO_BUYER_REQUIREMENTS
} from '../data/mockData';
import { DEMO_FARMER_PERSONAS } from '../data/panIndiaData';

const KEYS = {
  ROLE: 'smartagrilink_role',
  LANG: 'smartagrilink_lang',
  PERSONA: 'smartagrilink_active_persona',
  LOTS: 'smartagrilink_lots',
  OFFERS: 'smartagrilink_offers',
  TRANSACTIONS: 'smartagrilink_transactions',
  GRIEVANCES: 'smartagrilink_grievances',
  NOTIFICATIONS: 'smartagrilink_notifications',
  REQUIREMENTS: 'smartagrilink_requirements',
  INITIALIZED: 'smartagrilink_v1_init'
};


export const localStorageService = {
  initialize() {
    if (!localStorage.getItem(KEYS.INITIALIZED)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults() {
    localStorage.setItem(KEYS.ROLE, 'farmer');
    localStorage.setItem(KEYS.LANG, 'en');
    localStorage.setItem(KEYS.PERSONA, 'farmer-suresh-mh');
    localStorage.setItem(KEYS.LOTS, JSON.stringify(DEMO_LOTS));
    localStorage.setItem(KEYS.OFFERS, JSON.stringify(DEMO_OFFERS));
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(DEMO_TRANSACTIONS));
    localStorage.setItem(KEYS.GRIEVANCES, JSON.stringify(DEMO_GRIEVANCES));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(DEMO_NOTIFICATIONS));
    localStorage.setItem(KEYS.REQUIREMENTS, JSON.stringify(DEMO_BUYER_REQUIREMENTS));
    localStorage.setItem(KEYS.INITIALIZED, 'true');
  },

  getRole(): UserRole {
    return (localStorage.getItem(KEYS.ROLE) as UserRole) || 'farmer';
  },

  setRole(role: UserRole) {
    localStorage.setItem(KEYS.ROLE, role);
    window.dispatchEvent(new Event('smartagrilink_role_changed'));
  },

  getLanguage(): Language {
    return (localStorage.getItem(KEYS.LANG) as Language) || 'en';
  },

  setLanguage(lang: Language) {
    localStorage.setItem(KEYS.LANG, lang);
    window.dispatchEvent(new Event('smartagrilink_lang_changed'));
  },

  getPersona(): FarmerPersona {
    const id = localStorage.getItem(KEYS.PERSONA);
    const found = DEMO_FARMER_PERSONAS.find(p => p.id === id);
    return found || DEMO_FARMER_PERSONAS[0];
  },

  setPersona(personaId: string): FarmerPersona {
    const found = DEMO_FARMER_PERSONAS.find(p => p.id === personaId) || DEMO_FARMER_PERSONAS[0];
    localStorage.setItem(KEYS.PERSONA, found.id);
    window.dispatchEvent(new Event('smartagrilink_persona_changed'));
    window.dispatchEvent(new Event('smartagrilink_location_changed'));
    return found;
  },

  getAllPersonas(): FarmerPersona[] {
    return DEMO_FARMER_PERSONAS;
  },


  getLots(): DigitalLot[] {
    const data = localStorage.getItem(KEYS.LOTS);
    return data ? JSON.parse(data) : DEMO_LOTS;
  },

  saveLots(lots: DigitalLot[]) {
    localStorage.setItem(KEYS.LOTS, JSON.stringify(lots));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  },

  getOffers(): BuyerOffer[] {
    const data = localStorage.getItem(KEYS.OFFERS);
    return data ? JSON.parse(data) : DEMO_OFFERS;
  },

  saveOffers(offers: BuyerOffer[]) {
    localStorage.setItem(KEYS.OFFERS, JSON.stringify(offers));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  },

  getTransactions(): Transaction[] {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : DEMO_TRANSACTIONS;
  },

  saveTransactions(txns: Transaction[]) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txns));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  },

  getGrievances(): Grievance[] {
    const data = localStorage.getItem(KEYS.GRIEVANCES);
    return data ? JSON.parse(data) : DEMO_GRIEVANCES;
  },

  saveGrievances(grievances: Grievance[]) {
    localStorage.setItem(KEYS.GRIEVANCES, JSON.stringify(grievances));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  },

  getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : DEMO_NOTIFICATIONS;
  },

  saveNotifications(notifs: NotificationItem[]) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  },

  getRequirements(): BuyerDemandRequirement[] {
    const data = localStorage.getItem(KEYS.REQUIREMENTS);
    return data ? JSON.parse(data) : DEMO_BUYER_REQUIREMENTS;
  },

  saveRequirements(reqs: BuyerDemandRequirement[]) {
    localStorage.setItem(KEYS.REQUIREMENTS, JSON.stringify(reqs));
    window.dispatchEvent(new Event('smartagrilink_data_changed'));
  }
};

// Initialize immediately upon import
localStorageService.initialize();
