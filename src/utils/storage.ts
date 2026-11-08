import { Product, School, Message, SavTicket, ProspectionCode } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SCHOOLS,
  INITIAL_MESSAGES,
  INITIAL_SAV_TICKETS,
  INITIAL_PROSPECTION_CODES
} from '../data/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'ls_photo_products_v1',
  SCHOOLS: 'ls_photo_schools_v1',
  MESSAGES: 'ls_photo_messages_v1',
  SAV_TICKETS: 'ls_photo_sav_v1',
  PROSPECT_CODES: 'ls_photo_prospect_codes_v1',
  CURRENT_SCHOOL_CODE: 'ls_photo_current_school_code_v1',
};

export const getStoredProducts = (): Product[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return item ? JSON.parse(item) : INITIAL_PRODUCTS;
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products', e);
  }
};

export const getStoredSchools = (): School[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SCHOOLS);
    return item ? JSON.parse(item) : INITIAL_SCHOOLS;
  } catch {
    return INITIAL_SCHOOLS;
  }
};

export const saveStoredSchools = (schools: School[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHOOLS, JSON.stringify(schools));
  } catch (e) {
    console.error('Error saving schools', e);
  }
};

export const getStoredMessages = (): Message[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return item ? JSON.parse(item) : INITIAL_MESSAGES;
  } catch {
    return INITIAL_MESSAGES;
  }
};

export const saveStoredMessages = (messages: Message[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving messages', e);
  }
};

export const getStoredSavTickets = (): SavTicket[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.SAV_TICKETS);
    return item ? JSON.parse(item) : INITIAL_SAV_TICKETS;
  } catch {
    return INITIAL_SAV_TICKETS;
  }
};

export const saveStoredSavTickets = (tickets: SavTicket[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SAV_TICKETS, JSON.stringify(tickets));
  } catch (e) {
    console.error('Error saving SAV tickets', e);
  }
};

export const getStoredProspectionCodes = (): ProspectionCode[] => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROSPECT_CODES);
    return item ? JSON.parse(item) : INITIAL_PROSPECTION_CODES;
  } catch {
    return INITIAL_PROSPECTION_CODES;
  }
};

export const saveStoredProspectionCodes = (codes: ProspectionCode[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROSPECT_CODES, JSON.stringify(codes));
  } catch (e) {
    console.error('Error saving prospection codes', e);
  }
};

export const resetAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOLS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.SAV_TICKETS);
    localStorage.removeItem(STORAGE_KEYS.PROSPECT_CODES);
  } catch (e) {
    console.error('Error resetting data', e);
  }
};
