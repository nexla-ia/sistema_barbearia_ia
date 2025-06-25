export interface ClientProfile {
  id: string;
  // Campos obrigatórios
  fullName: string;
  phone: string;
  email: string;
  birthDate: Date;
  anniversaryDate?: Date;
  
  // Campos opcionais
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cpf?: string;
  photo?: string;
  
  // Documentos e termos
  documents: ClientDocument[];
  termsAccepted: TermsAcceptance[];
  
  // Preferências
  preferences: ClientPreferences;
  
  // Sistema de fidelidade
  loyaltyProgram: LoyaltyProgram;
  
  // Histórico
  serviceHistory: ServiceRecord[];
  productHistory: ProductPurchase[];
  feedbackHistory: ClientFeedback[];
  photoGallery: ClientPhoto[];
  
  // Comunicação
  communicationPreferences: CommunicationPreferences;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  lastVisit?: Date;
  totalSpent: number;
  visitCount: number;
  status: 'active' | 'inactive' | 'blocked';
  
  // LGPD
  lgpdConsent: LGPDConsent;
}

export interface ClientDocument {
  id: string;
  type: 'rg' | 'cpf' | 'contract' | 'terms' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
  expiresAt?: Date;
}

export interface TermsAcceptance {
  id: string;
  termType: 'privacy_policy' | 'terms_of_service' | 'marketing_consent';
  version: string;
  acceptedAt: Date;
  ipAddress: string;
}

export interface ClientPreferences {
  favoriteServices: string[];
  preferredProfessional?: string;
  specialNotes: string;
  allergies: string[];
  restrictions: string[];
  preferredFrequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'custom';
  customFrequencyDays?: number;
  preferredTimeSlots: string[];
  preferredDays: number[]; // 0-6 (Sunday-Saturday)
}

export interface LoyaltyProgram {
  currentPoints: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  currentLevel: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextLevelPoints: number;
  benefits: LoyaltyBenefit[];
  pointsHistory: PointsTransaction[];
}

export interface LoyaltyBenefit {
  id: string;
  type: 'discount' | 'free_service' | 'priority_booking' | 'birthday_gift';
  description: string;
  value: number;
  isActive: boolean;
  expiresAt?: Date;
}

export interface PointsTransaction {
  id: string;
  type: 'earned' | 'redeemed' | 'expired' | 'bonus';
  points: number;
  description: string;
  relatedServiceId?: string;
  relatedPurchaseId?: string;
  createdAt: Date;
}

export interface ServiceRecord {
  id: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: Date;
  duration: number;
  price: number;
  discount?: number;
  finalPrice: number;
  status: 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  pointsEarned: number;
}

export interface ProductPurchase {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: Date;
  pointsEarned: number;
}

export interface ClientFeedback {
  id: string;
  serviceId: string;
  rating: number; // 1-5
  comment: string;
  professionalRating: number;
  serviceRating: number;
  facilityRating: number;
  wouldRecommend: boolean;
  createdAt: Date;
  isPublic: boolean;
}

export interface ClientPhoto {
  id: string;
  serviceId?: string;
  type: 'before' | 'after' | 'process' | 'result';
  url: string;
  description?: string;
  takenAt: Date;
  isPublic: boolean;
  professionalId: string;
}

export interface CommunicationPreferences {
  whatsapp: boolean;
  email: boolean;
  sms: boolean;
  phone: boolean;
  marketingConsent: boolean;
  reminderPreference: 'none' | '1_hour' | '2_hours' | '1_day' | '2_days';
  birthdayMessages: boolean;
  promotionalMessages: boolean;
}

export interface LGPDConsent {
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  dataRetentionPeriod: number; // em anos
  consentDate: Date;
  lastUpdated: Date;
  dataPortabilityRequests: DataPortabilityRequest[];
  deletionRequests: DeletionRequest[];
}

export interface DataPortabilityRequest {
  id: string;
  requestedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface DeletionRequest {
  id: string;
  requestedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  reason: string;
  retentionPeriodEnd: Date;
}

export interface ClientSearchFilters {
  name?: string;
  phone?: string;
  email?: string;
  lastVisitFrom?: Date;
  lastVisitTo?: Date;
  servicesPerformed?: string[];
  totalSpentMin?: number;
  totalSpentMax?: number;
  loyaltyLevel?: string[];
  status?: string[];
  professionalId?: string;
  hasAllergies?: boolean;
  birthdayMonth?: number;
}

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'welcome' | 'reminder' | 'birthday' | 'promotion' | 'feedback' | 'custom';
  channel: 'whatsapp' | 'email' | 'sms';
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
}

export interface ScheduledMessage {
  id: string;
  clientId: string;
  templateId: string;
  channel: 'whatsapp' | 'email' | 'sms';
  scheduledFor: Date;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sentAt?: Date;
  errorMessage?: string;
  variables: Record<string, string>;
}

export interface EngagementReport {
  period: {
    start: Date;
    end: Date;
  };
  totalMessagesSent: number;
  messagesByChannel: {
    whatsapp: number;
    email: number;
    sms: number;
  };
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  topPerformingTemplates: {
    templateId: string;
    templateName: string;
    sentCount: number;
    openRate: number;
  }[];
}