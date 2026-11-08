/**
 * Types pour l'application Laurent Serres - Photographie Scolaire
 */

export type ProductCategory = 'pochettes' | 'objets' | 'tirages';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  dimensions?: string;
  ratio: '3:2' | 'standard' | 'objet';
  description: string;
  baseSchoolPrice: number;     // Prix École TTC (Laurent Serres) - modifiable uniquement par Admin
  averageMarketPrice: number;  // Prix moyen constaté dans les écoles du Gard/France
  defaultResalePrice: number;  // Prix de vente conseillé aux parents
  minResalePrice?: number;
  highlight?: boolean;
}

export interface SchoolProductConfig {
  productId: string;
  enabled: boolean;
  resalePrice: number;
}

export interface School {
  id: string;
  code: string;                 // ex: OLIVIERS30
  name: string;
  city: string;
  postalCode: string;
  type: 'maternelle' | 'elementaire' | 'primaire';
  studentCount: number;
  directorName: string;
  email: string;
  phone: string;
  productConfigs: Record<string, SchoolProductConfig>; // productId -> config
  status: 'active' | 'pending';
  lastGridValidatedAt?: string;
  preferredShootDate?: string;
  shootPeriod?: 'matin' | 'journee_entiere';
  notes?: string;
}

export interface Message {
  id: string;
  schoolId: string;
  schoolCode: string;
  schoolName: string;
  sender: 'school' | 'photographer';
  authorName: string;
  type: 'chat' | 'date_proposal' | 'sample_request' | 'grid_validation';
  content: string;
  metadata?: {
    dateProposed?: string;
    period?: 'matin' | 'journee_entiere';
    sampleAddress?: string;
    totalActiveProducts?: number;
    estimatedMarginTotal?: number;
  };
  timestamp: string;
  readByAdmin: boolean;
  readBySchool: boolean;
}

export interface SavTicket {
  id: string;
  ticketNumber: string;
  parentName: string;
  email: string;
  phone: string;
  schoolName: string;
  childName: string;
  classLevel: string;
  issueType: 'qr_lost' | 'forgotten_order' | 'damaged_item' | 'download_issue' | 'other';
  orderReference?: string;
  description: string;
  createdAt: string;
  status: 'nouveau' | 'en_cours' | 'resolu';
  adminNotes?: string;
}

export interface ProspectionCode {
  code: string;
  label: string;
  targetSchoolName?: string;
  createdAt: string;
  usesCount: number;
}

export type ActivePortal = 'home' | 'partner' | 'prospect' | 'parent' | 'admin';
