export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // em minutos
  category: 'corte' | 'barba' | 'quimica' | 'estetica' | 'tratamento';
  isActive: boolean;
  image?: string;
  
  // Profissionais habilitados
  enabledProfessionals: string[];
  
  // Configurações avançadas
  requirements?: string[];
  contraindications?: string[];
  afterCareInstructions?: string;
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Histórico de preços
  priceHistory: PriceHistoryEntry[];
  
  // Estatísticas
  metrics: ServiceMetrics;
}

export interface PriceHistoryEntry {
  id: string;
  previousPrice: number;
  newPrice: number;
  changeReason: string;
  changedBy: string;
  changedAt: Date;
}

export interface ServiceMetrics {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  popularityRank: number;
  lastBooking?: Date;
  monthlyBookings: number;
  monthlyRevenue: number;
  conversionRate: number; // Taxa de conversão de visualizações para agendamentos
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: PackageService[];
  originalPrice: number;
  discountPercentage: number;
  finalPrice: number;
  
  // Configurações de validade
  validityPeriod: number; // em dias
  usageLimit: number; // quantas vezes pode ser usado por cliente
  
  // Status e disponibilidade
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  
  // Restrições
  minimumAdvanceBooking?: number; // horas
  allowedDays?: number[]; // dias da semana (0-6)
  allowedTimeSlots?: string[];
  
  // Metadados
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  
  // Estatísticas
  metrics: PackageMetrics;
}

export interface PackageService {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  isRequired: boolean; // Se é obrigatório no pacote
  canBeReplaced: boolean; // Se pode ser substituído por outro serviço
  replacementOptions?: string[]; // IDs dos serviços que podem substituir
}

export interface PackageMetrics {
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  conversionRate: number;
  popularityRank: number;
  lastSale?: Date;
  monthlySales: number;
  monthlyRevenue: number;
}

export interface ServiceSearchFilters {
  name?: string;
  category?: string[];
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  professionalId?: string;
  isActive?: boolean;
  popularityMin?: number;
  ratingMin?: number;
}

export interface PackageSearchFilters {
  name?: string;
  discountMin?: number;
  discountMax?: number;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  validityPeriodMin?: number;
  validityPeriodMax?: number;
}

export interface ServiceReport {
  period: {
    start: Date;
    end: Date;
  };
  topServices: {
    serviceId: string;
    serviceName: string;
    bookings: number;
    revenue: number;
    averageRating: number;
    growthRate: number;
  }[];
  categoryPerformance: {
    category: string;
    totalBookings: number;
    totalRevenue: number;
    averagePrice: number;
    marketShare: number;
  }[];
  revenueAnalysis: {
    totalRevenue: number;
    averageTicket: number;
    totalBookings: number;
    conversionRate: number;
  };
  trends: {
    mostGrowingService: string;
    mostDecliningService: string;
    seasonalTrends: {
      month: string;
      bookings: number;
      revenue: number;
    }[];
  };
}

export interface PackageReport {
  period: {
    start: Date;
    end: Date;
  };
  topPackages: {
    packageId: string;
    packageName: string;
    sales: number;
    revenue: number;
    conversionRate: number;
    averageRating: number;
  }[];
  discountAnalysis: {
    averageDiscount: number;
    totalSavingsOffered: number;
    revenueImpact: number;
    customerSatisfaction: number;
  };
  usagePatterns: {
    averageUsageRate: number;
    mostUsedPackage: string;
    leastUsedPackage: string;
    expirationRate: number;
  };
}

export interface ServiceValidation {
  name: {
    isValid: boolean;
    message?: string;
  };
  description: {
    isValid: boolean;
    message?: string;
  };
  price: {
    isValid: boolean;
    message?: string;
  };
  duration: {
    isValid: boolean;
    message?: string;
  };
  category: {
    isValid: boolean;
    message?: string;
  };
  enabledProfessionals: {
    isValid: boolean;
    message?: string;
  };
}

export interface PackageValidation {
  name: {
    isValid: boolean;
    message?: string;
  };
  services: {
    isValid: boolean;
    message?: string;
  };
  discountPercentage: {
    isValid: boolean;
    message?: string;
  };
  validityPeriod: {
    isValid: boolean;
    message?: string;
  };
  usageLimit: {
    isValid: boolean;
    message?: string;
  };
}