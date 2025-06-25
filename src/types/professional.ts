export interface Professional {
  id: string;
  // Dados pessoais
  fullName: string;
  cpf: string;
  rg: string;
  birthDate: Date;
  
  // Endereço
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Contatos
  phone: string;
  email: string;
  whatsapp?: string;
  
  // Profissional
  photo?: string;
  specialties: string[];
  services: ProfessionalService[];
  
  // Horários de trabalho
  workingHours: WorkingSchedule;
  
  // Dados contratuais
  admissionDate: Date;
  contractType: 'employee' | 'freelancer' | 'partner';
  status: 'active' | 'inactive' | 'vacation' | 'medical_leave';
  
  // Documentos
  documents: ProfessionalDocument[];
  
  // Métricas
  metrics: ProfessionalMetrics;
  
  // Configurações
  settings: ProfessionalSettings;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface ProfessionalService {
  serviceId: string;
  serviceName: string;
  commissionRate: number; // Percentual de comissão (0-100)
  isActive: boolean;
  minimumPrice?: number;
  maximumPrice?: number;
}

export interface WorkingSchedule {
  regularHours: {
    [key: string]: {
      isWorking: boolean;
      startTime: string;
      endTime: string;
      breakStart?: string;
      breakEnd?: string;
    };
  };
  fixedDaysOff: number[]; // Dias da semana (0-6)
  vacations: VacationPeriod[];
  absences: AbsencePeriod[];
  specialSchedules: SpecialSchedule[];
}

export interface VacationPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  type: 'vacation' | 'medical_leave' | 'personal_leave';
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface AbsencePeriod {
  id: string;
  date: Date;
  type: 'sick' | 'personal' | 'emergency' | 'other';
  isJustified: boolean;
  reason?: string;
  documentUrl?: string;
  reportedAt: Date;
  reportedBy: string;
}

export interface SpecialSchedule {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  type: 'holiday_work' | 'event' | 'overtime' | 'other';
}

export interface ProfessionalDocument {
  id: string;
  type: 'certificate' | 'diploma' | 'license' | 'contract' | 'other';
  name: string;
  description?: string;
  url: string;
  expiresAt?: Date;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ProfessionalMetrics {
  // Atendimentos
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  
  // Financeiro
  totalRevenue: number;
  totalCommissions: number;
  averageTicket: number;
  
  // Avaliações
  averageRating: number;
  totalReviews: number;
  recommendationRate: number;
  
  // Performance
  punctualityRate: number;
  rebookingRate: number;
  
  // Período de cálculo
  periodStart: Date;
  periodEnd: Date;
  lastUpdated: Date;
}

export interface ProfessionalSettings {
  // Notificações
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  
  // Preferências de agenda
  schedulePreferences: {
    allowOnlineBooking: boolean;
    requireConfirmation: boolean;
    maxAdvanceBookingDays: number;
    minAdvanceBookingHours: number;
    allowSameDayBooking: boolean;
  };
  
  // Acesso ao sistema
  systemAccess: {
    canViewOwnSchedule: boolean;
    canEditOwnSchedule: boolean;
    canViewOwnMetrics: boolean;
    canViewClientHistory: boolean;
    canManageOwnServices: boolean;
  };
}

export interface ProfessionalSearchFilters {
  name?: string;
  specialty?: string;
  status?: string[];
  contractType?: string[];
  admissionDateFrom?: Date;
  admissionDateTo?: Date;
  hasDocumentExpiring?: boolean;
  averageRatingMin?: number;
  totalRevenueMin?: number;
  totalRevenueMax?: number;
}

export interface ScheduleEvent {
  id: string;
  professionalId: string;
  type: 'appointment' | 'break' | 'vacation' | 'absence' | 'special';
  title: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  description?: string;
  clientId?: string;
  clientName?: string;
  serviceId?: string;
  serviceName?: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  color?: string;
}

export interface CommissionReport {
  professionalId: string;
  professionalName: string;
  period: {
    start: Date;
    end: Date;
  };
  services: {
    serviceId: string;
    serviceName: string;
    appointmentCount: number;
    totalRevenue: number;
    commissionRate: number;
    commissionAmount: number;
  }[];
  totalRevenue: number;
  totalCommission: number;
  deductions?: {
    type: string;
    description: string;
    amount: number;
  }[];
  netCommission: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
  paymentDate?: Date;
}

export interface PerformanceReport {
  professionalId: string;
  professionalName: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    totalAppointments: number;
    completedAppointments: number;
    completionRate: number;
    averageRating: number;
    totalRevenue: number;
    averageTicket: number;
    punctualityRate: number;
    rebookingRate: number;
    noShowRate: number;
    cancellationRate: number;
  };
  comparison: {
    previousPeriod: {
      totalAppointments: number;
      totalRevenue: number;
      averageRating: number;
    };
    growth: {
      appointments: number;
      revenue: number;
      rating: number;
    };
  };
  ranking: {
    position: number;
    totalProfessionals: number;
    category: 'revenue' | 'appointments' | 'rating';
  };
}

export interface NotificationSettings {
  scheduleChanges: boolean;
  newAppointments: boolean;
  cancellations: boolean;
  clientMessages: boolean;
  performanceReports: boolean;
  commissionReports: boolean;
  documentExpiration: boolean;
  systemUpdates: boolean;
}

export interface ProfessionalAvailability {
  professionalId: string;
  date: string;
  isAvailable: boolean;
  workingHours?: {
    start: string;
    end: string;
  };
  breaks: {
    start: string;
    end: string;
    reason: string;
  }[];
  appointments: {
    id: string;
    startTime: string;
    endTime: string;
    clientName: string;
    serviceName: string;
    status: string;
  }[];
  blockedSlots: {
    startTime: string;
    endTime: string;
    reason: string;
  }[];
}