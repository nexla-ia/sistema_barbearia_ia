import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Service, 
  ServicePackage, 
  ServiceSearchFilters, 
  PackageSearchFilters,
  ServiceReport,
  PackageReport,
  ServiceValidation,
  PackageValidation,
  PriceHistoryEntry 
} from '../types/service';

interface ServiceState {
  services: Service[];
  packages: ServicePackage[];
  selectedService: Service | null;
  selectedPackage: ServicePackage | null;
  searchFilters: ServiceSearchFilters;
  packageFilters: PackageSearchFilters;
  loading: boolean;
  error: string | null;
}

type ServiceAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'DELETE_SERVICE'; payload: string }
  | { type: 'SET_PACKAGES'; payload: ServicePackage[] }
  | { type: 'ADD_PACKAGE'; payload: ServicePackage }
  | { type: 'UPDATE_PACKAGE'; payload: ServicePackage }
  | { type: 'DELETE_PACKAGE'; payload: string }
  | { type: 'SET_SELECTED_SERVICE'; payload: Service | null }
  | { type: 'SET_SELECTED_PACKAGE'; payload: ServicePackage | null }
  | { type: 'SET_SEARCH_FILTERS'; payload: ServiceSearchFilters }
  | { type: 'SET_PACKAGE_FILTERS'; payload: PackageSearchFilters };

const initialState: ServiceState = {
  services: [],
  packages: [],
  selectedService: null,
  selectedPackage: null,
  searchFilters: {},
  packageFilters: {},
  loading: false,
  error: null,
};

function serviceReducer(state: ServiceState, action: ServiceAction): ServiceState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'UPDATE_SERVICE':
      return {
        ...state,
        services: state.services.map(service =>
          service.id === action.payload.id ? action.payload : service
        ),
        selectedService: state.selectedService?.id === action.payload.id ? action.payload : state.selectedService,
      };
    case 'DELETE_SERVICE':
      return {
        ...state,
        services: state.services.filter(service => service.id !== action.payload),
        selectedService: state.selectedService?.id === action.payload ? null : state.selectedService,
      };
    case 'SET_PACKAGES':
      return { ...state, packages: action.payload };
    case 'ADD_PACKAGE':
      return { ...state, packages: [...state.packages, action.payload] };
    case 'UPDATE_PACKAGE':
      return {
        ...state,
        packages: state.packages.map(pkg =>
          pkg.id === action.payload.id ? action.payload : pkg
        ),
        selectedPackage: state.selectedPackage?.id === action.payload.id ? action.payload : state.selectedPackage,
      };
    case 'DELETE_PACKAGE':
      return {
        ...state,
        packages: state.packages.filter(pkg => pkg.id !== action.payload),
        selectedPackage: state.selectedPackage?.id === action.payload ? null : state.selectedPackage,
      };
    case 'SET_SELECTED_SERVICE':
      return { ...state, selectedService: action.payload };
    case 'SET_SELECTED_PACKAGE':
      return { ...state, selectedPackage: action.payload };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_PACKAGE_FILTERS':
      return { ...state, packageFilters: action.payload };
    default:
      return state;
  }
}

const ServiceContext = createContext<{
  state: ServiceState;
  dispatch: React.Dispatch<ServiceAction>;
  searchServices: (filters: ServiceSearchFilters) => Service[];
  searchPackages: (filters: PackageSearchFilters) => ServicePackage[];
  validateService: (service: Partial<Service>) => ServiceValidation;
  validatePackage: (pkg: Partial<ServicePackage>) => PackageValidation;
  updateServicePrice: (serviceId: string, newPrice: number, reason: string) => Promise<void>;
  generateServiceReport: (startDate: Date, endDate: Date) => Promise<ServiceReport>;
  generatePackageReport: (startDate: Date, endDate: Date) => Promise<PackageReport>;
  duplicateService: (serviceId: string) => Promise<Service>;
  duplicatePackage: (packageId: string) => Promise<ServicePackage>;
} | null>(null);

export function ServiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(serviceReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock data - in production, this would come from your API
      const mockServices: Service[] = [
        {
          id: 's1',
          name: 'Corte Masculino Tradicional',
          description: 'Corte clássico masculino com máquina e tesoura, incluindo acabamento na nuca e laterais. Ideal para um visual elegante e profissional.',
          price: 35.00,
          duration: 30,
          category: 'corte',
          isActive: true,
          image: 'https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=300',
          enabledProfessionals: ['p1', 'p2'],
          requirements: ['Cabelo limpo', 'Definir estilo desejado'],
          contraindications: ['Feridas no couro cabeludo', 'Infecções'],
          afterCareInstructions: 'Evitar molhar por 2 horas. Usar produtos recomendados.',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          priceHistory: [
            {
              id: 'ph1',
              previousPrice: 30.00,
              newPrice: 35.00,
              changeReason: 'Ajuste de inflação',
              changedBy: 'admin',
              changedAt: new Date('2024-01-15'),
            },
          ],
          metrics: {
            totalBookings: 450,
            totalRevenue: 15750,
            averageRating: 4.8,
            totalReviews: 380,
            popularityRank: 1,
            lastBooking: new Date(),
            monthlyBookings: 85,
            monthlyRevenue: 2975,
            conversionRate: 78.5,
          },
        },
        {
          id: 's2',
          name: 'Barba Completa',
          description: 'Aparar, modelar e finalizar barba com navalha. Inclui hidratação e aplicação de óleo para barba. Resultado profissional garantido.',
          price: 25.00,
          duration: 25,
          category: 'barba',
          isActive: true,
          image: 'https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=300',
          enabledProfessionals: ['p1'],
          requirements: ['Barba com pelo menos 3mm', 'Pele limpa'],
          contraindications: ['Alergia a produtos', 'Feridas na face'],
          afterCareInstructions: 'Aplicar óleo hidratante diariamente.',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          priceHistory: [],
          metrics: {
            totalBookings: 320,
            totalRevenue: 8000,
            averageRating: 4.9,
            totalReviews: 280,
            popularityRank: 2,
            lastBooking: new Date(),
            monthlyBookings: 65,
            monthlyRevenue: 1625,
            conversionRate: 82.1,
          },
        },
        {
          id: 's3',
          name: 'Sobrancelha Masculina',
          description: 'Design e modelagem de sobrancelha masculina com pinça e tesoura. Resultado natural respeitando o formato do rosto.',
          price: 15.00,
          duration: 15,
          category: 'estetica',
          isActive: true,
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300',
          enabledProfessionals: ['p2'],
          requirements: ['Pelos com crescimento mínimo'],
          contraindications: ['Inflamações na região'],
          afterCareInstructions: 'Evitar exposição solar por 24h.',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          priceHistory: [],
          metrics: {
            totalBookings: 180,
            totalRevenue: 2700,
            averageRating: 4.6,
            totalReviews: 150,
            popularityRank: 4,
            lastBooking: new Date(),
            monthlyBookings: 35,
            monthlyRevenue: 525,
            conversionRate: 65.8,
          },
        },
        {
          id: 's4',
          name: 'Lavagem + Hidratação',
          description: 'Lavagem completa com shampoo premium e tratamento hidratante. Inclui massagem relaxante no couro cabeludo.',
          price: 20.00,
          duration: 20,
          category: 'tratamento',
          isActive: true,
          image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=300',
          enabledProfessionals: ['p1', 'p2'],
          requirements: ['Cabelo seco'],
          contraindications: ['Alergia a produtos químicos'],
          afterCareInstructions: 'Não usar produtos com álcool por 24h.',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          priceHistory: [],
          metrics: {
            totalBookings: 220,
            totalRevenue: 4400,
            averageRating: 4.7,
            totalReviews: 180,
            popularityRank: 3,
            lastBooking: new Date(),
            monthlyBookings: 45,
            monthlyRevenue: 900,
            conversionRate: 71.2,
          },
        },
      ];

      const mockPackages: ServicePackage[] = [
        {
          id: 'pkg1',
          name: 'Combo Completo',
          description: 'Corte + Barba + Sobrancelha - O pacote mais completo para um visual impecável',
          services: [
            {
              serviceId: 's1',
              serviceName: 'Corte Masculino Tradicional',
              servicePrice: 35.00,
              serviceDuration: 30,
              isRequired: true,
              canBeReplaced: false,
            },
            {
              serviceId: 's2',
              serviceName: 'Barba Completa',
              servicePrice: 25.00,
              serviceDuration: 25,
              isRequired: true,
              canBeReplaced: false,
            },
            {
              serviceId: 's3',
              serviceName: 'Sobrancelha Masculina',
              servicePrice: 15.00,
              serviceDuration: 15,
              isRequired: false,
              canBeReplaced: true,
              replacementOptions: ['s4'],
            },
          ],
          originalPrice: 75.00,
          discountPercentage: 20,
          finalPrice: 60.00,
          validityPeriod: 30,
          usageLimit: 1,
          isActive: true,
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          minimumAdvanceBooking: 2,
          allowedDays: [1, 2, 3, 4, 5, 6],
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          metrics: {
            totalSales: 85,
            totalRevenue: 5100,
            averageRating: 4.8,
            conversionRate: 15.2,
            popularityRank: 1,
            lastSale: new Date(),
            monthlySales: 18,
            monthlyRevenue: 1080,
          },
        },
        {
          id: 'pkg2',
          name: 'Duo Clássico',
          description: 'Corte + Barba - A combinação perfeita para o homem moderno',
          services: [
            {
              serviceId: 's1',
              serviceName: 'Corte Masculino Tradicional',
              servicePrice: 35.00,
              serviceDuration: 30,
              isRequired: true,
              canBeReplaced: false,
            },
            {
              serviceId: 's2',
              serviceName: 'Barba Completa',
              servicePrice: 25.00,
              serviceDuration: 25,
              isRequired: true,
              canBeReplaced: false,
            },
          ],
          originalPrice: 60.00,
          discountPercentage: 15,
          finalPrice: 51.00,
          validityPeriod: 45,
          usageLimit: 2,
          isActive: true,
          startDate: new Date('2024-01-01'),
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          createdBy: 'admin',
          metrics: {
            totalSales: 120,
            totalRevenue: 6120,
            averageRating: 4.9,
            conversionRate: 22.8,
            popularityRank: 2,
            lastSale: new Date(),
            monthlySales: 25,
            monthlyRevenue: 1275,
          },
        },
      ];

      dispatch({ type: 'SET_SERVICES', payload: mockServices });
      dispatch({ type: 'SET_PACKAGES', payload: mockPackages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load service data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchServices = (filters: ServiceSearchFilters): Service[] => {
    return state.services.filter(service => {
      if (filters.name && !service.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.category && filters.category.length > 0 && !filters.category.includes(service.category)) {
        return false;
      }
      if (filters.priceMin && service.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && service.price > filters.priceMax) {
        return false;
      }
      if (filters.durationMin && service.duration < filters.durationMin) {
        return false;
      }
      if (filters.durationMax && service.duration > filters.durationMax) {
        return false;
      }
      if (filters.professionalId && !service.enabledProfessionals.includes(filters.professionalId)) {
        return false;
      }
      if (filters.isActive !== undefined && service.isActive !== filters.isActive) {
        return false;
      }
      if (filters.popularityMin && service.metrics.popularityRank > filters.popularityMin) {
        return false;
      }
      if (filters.ratingMin && service.metrics.averageRating < filters.ratingMin) {
        return false;
      }
      return true;
    });
  };

  const searchPackages = (filters: PackageSearchFilters): ServicePackage[] => {
    return state.packages.filter(pkg => {
      if (filters.name && !pkg.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.discountMin && pkg.discountPercentage < filters.discountMin) {
        return false;
      }
      if (filters.discountMax && pkg.discountPercentage > filters.discountMax) {
        return false;
      }
      if (filters.priceMin && pkg.finalPrice < filters.priceMin) {
        return false;
      }
      if (filters.priceMax && pkg.finalPrice > filters.priceMax) {
        return false;
      }
      if (filters.isActive !== undefined && pkg.isActive !== filters.isActive) {
        return false;
      }
      if (filters.validityPeriodMin && pkg.validityPeriod < filters.validityPeriodMin) {
        return false;
      }
      if (filters.validityPeriodMax && pkg.validityPeriod > filters.validityPeriodMax) {
        return false;
      }
      return true;
    });
  };

  const validateService = (service: Partial<Service>): ServiceValidation => {
    const validation: ServiceValidation = {
      name: { isValid: true },
      description: { isValid: true },
      price: { isValid: true },
      duration: { isValid: true },
      category: { isValid: true },
      enabledProfessionals: { isValid: true },
    };

    // Validar nome
    if (!service.name || service.name.trim().length === 0) {
      validation.name = { isValid: false, message: 'Nome é obrigatório' };
    } else if (service.name.length > 50) {
      validation.name = { isValid: false, message: 'Nome deve ter no máximo 50 caracteres' };
    }

    // Validar descrição
    if (!service.description || service.description.trim().length === 0) {
      validation.description = { isValid: false, message: 'Descrição é obrigatória' };
    } else if (service.description.length > 1000) {
      validation.description = { isValid: false, message: 'Descrição deve ter no máximo 1000 caracteres' };
    }

    // Validar preço
    if (!service.price || service.price <= 0) {
      validation.price = { isValid: false, message: 'Preço deve ser maior que zero' };
    } else if (service.price > 9999.99) {
      validation.price = { isValid: false, message: 'Preço deve ser menor que R$ 9.999,99' };
    }

    // Validar duração
    if (!service.duration || service.duration <= 0) {
      validation.duration = { isValid: false, message: 'Duração deve ser maior que zero' };
    } else if (service.duration > 480) {
      validation.duration = { isValid: false, message: 'Duração deve ser menor que 8 horas' };
    }

    // Validar categoria
    const validCategories = ['corte', 'barba', 'quimica', 'estetica', 'tratamento'];
    if (!service.category || !validCategories.includes(service.category)) {
      validation.category = { isValid: false, message: 'Categoria inválida' };
    }

    // Validar profissionais habilitados
    if (!service.enabledProfessionals || service.enabledProfessionals.length === 0) {
      validation.enabledProfessionals = { isValid: false, message: 'Pelo menos um profissional deve ser habilitado' };
    }

    return validation;
  };

  const validatePackage = (pkg: Partial<ServicePackage>): PackageValidation => {
    const validation: PackageValidation = {
      name: { isValid: true },
      services: { isValid: true },
      discountPercentage: { isValid: true },
      validityPeriod: { isValid: true },
      usageLimit: { isValid: true },
    };

    // Validar nome
    if (!pkg.name || pkg.name.trim().length === 0) {
      validation.name = { isValid: false, message: 'Nome é obrigatório' };
    } else if (pkg.name.length > 100) {
      validation.name = { isValid: false, message: 'Nome deve ter no máximo 100 caracteres' };
    }

    // Validar serviços
    if (!pkg.services || pkg.services.length < 2) {
      validation.services = { isValid: false, message: 'Pacote deve ter pelo menos 2 serviços' };
    } else if (pkg.services.length > 5) {
      validation.services = { isValid: false, message: 'Pacote deve ter no máximo 5 serviços' };
    }

    // Validar desconto
    if (!pkg.discountPercentage || pkg.discountPercentage <= 0) {
      validation.discountPercentage = { isValid: false, message: 'Desconto deve ser maior que zero' };
    } else if (pkg.discountPercentage > 70) {
      validation.discountPercentage = { isValid: false, message: 'Desconto deve ser menor que 70%' };
    }

    // Validar período de validade
    if (!pkg.validityPeriod || pkg.validityPeriod < 15) {
      validation.validityPeriod = { isValid: false, message: 'Período de validade deve ser pelo menos 15 dias' };
    } else if (pkg.validityPeriod > 90) {
      validation.validityPeriod = { isValid: false, message: 'Período de validade deve ser no máximo 90 dias' };
    }

    // Validar limite de uso
    if (!pkg.usageLimit || pkg.usageLimit <= 0) {
      validation.usageLimit = { isValid: false, message: 'Limite de uso deve ser maior que zero' };
    } else if (pkg.usageLimit > 10) {
      validation.usageLimit = { isValid: false, message: 'Limite de uso deve ser no máximo 10' };
    }

    return validation;
  };

  const updateServicePrice = async (serviceId: string, newPrice: number, reason: string): Promise<void> => {
    const service = state.services.find(s => s.id === serviceId);
    if (!service) return;

    const priceHistoryEntry: PriceHistoryEntry = {
      id: `ph_${Date.now()}`,
      previousPrice: service.price,
      newPrice,
      changeReason: reason,
      changedBy: 'admin', // In production, get from auth context
      changedAt: new Date(),
    };

    const updatedService: Service = {
      ...service,
      price: newPrice,
      priceHistory: [...service.priceHistory, priceHistoryEntry],
      updatedAt: new Date(),
    };

    dispatch({ type: 'UPDATE_SERVICE', payload: updatedService });
  };

  const generateServiceReport = async (startDate: Date, endDate: Date): Promise<ServiceReport> => {
    // Mock report generation - in production, this would call your API
    const report: ServiceReport = {
      period: { start: startDate, end: endDate },
      topServices: state.services
        .sort((a, b) => b.metrics.monthlyBookings - a.metrics.monthlyBookings)
        .slice(0, 10)
        .map(service => ({
          serviceId: service.id,
          serviceName: service.name,
          bookings: service.metrics.monthlyBookings,
          revenue: service.metrics.monthlyRevenue,
          averageRating: service.metrics.averageRating,
          growthRate: Math.random() * 20 - 10, // Mock growth rate
        })),
      categoryPerformance: [
        {
          category: 'corte',
          totalBookings: 450,
          totalRevenue: 15750,
          averagePrice: 35,
          marketShare: 45,
        },
        {
          category: 'barba',
          totalBookings: 320,
          totalRevenue: 8000,
          averagePrice: 25,
          marketShare: 32,
        },
        {
          category: 'estetica',
          totalBookings: 180,
          totalRevenue: 2700,
          averagePrice: 15,
          marketShare: 18,
        },
        {
          category: 'tratamento',
          totalBookings: 220,
          totalRevenue: 4400,
          averagePrice: 20,
          marketShare: 22,
        },
      ],
      revenueAnalysis: {
        totalRevenue: 30850,
        averageTicket: 26.5,
        totalBookings: 1170,
        conversionRate: 74.2,
      },
      trends: {
        mostGrowingService: 'Corte Masculino Tradicional',
        mostDecliningService: 'Sobrancelha Masculina',
        seasonalTrends: [
          { month: 'Jan', bookings: 95, revenue: 2520 },
          { month: 'Fev', bookings: 88, revenue: 2340 },
          { month: 'Mar', bookings: 102, revenue: 2710 },
          { month: 'Abr', bookings: 97, revenue: 2580 },
          { month: 'Mai', bookings: 105, revenue: 2790 },
          { month: 'Jun', bookings: 110, revenue: 2920 },
        ],
      },
    };

    return report;
  };

  const generatePackageReport = async (startDate: Date, endDate: Date): Promise<PackageReport> => {
    // Mock report generation
    const report: PackageReport = {
      period: { start: startDate, end: endDate },
      topPackages: state.packages
        .sort((a, b) => b.metrics.monthlySales - a.metrics.monthlySales)
        .map(pkg => ({
          packageId: pkg.id,
          packageName: pkg.name,
          sales: pkg.metrics.monthlySales,
          revenue: pkg.metrics.monthlyRevenue,
          conversionRate: pkg.metrics.conversionRate,
          averageRating: pkg.metrics.averageRating,
        })),
      discountAnalysis: {
        averageDiscount: 17.5,
        totalSavingsOffered: 4250,
        revenueImpact: 15.8,
        customerSatisfaction: 4.85,
      },
      usagePatterns: {
        averageUsageRate: 85.2,
        mostUsedPackage: 'Combo Completo',
        leastUsedPackage: 'Duo Clássico',
        expirationRate: 12.5,
      },
    };

    return report;
  };

  const duplicateService = async (serviceId: string): Promise<Service> => {
    const originalService = state.services.find(s => s.id === serviceId);
    if (!originalService) {
      throw new Error('Service not found');
    }

    const duplicatedService: Service = {
      ...originalService,
      id: `s_${Date.now()}`,
      name: `${originalService.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      priceHistory: [],
      metrics: {
        ...originalService.metrics,
        totalBookings: 0,
        totalRevenue: 0,
        totalReviews: 0,
        monthlyBookings: 0,
        monthlyRevenue: 0,
        lastBooking: undefined,
      },
    };

    dispatch({ type: 'ADD_SERVICE', payload: duplicatedService });
    return duplicatedService;
  };

  const duplicatePackage = async (packageId: string): Promise<ServicePackage> => {
    const originalPackage = state.packages.find(p => p.id === packageId);
    if (!originalPackage) {
      throw new Error('Package not found');
    }

    const duplicatedPackage: ServicePackage = {
      ...originalPackage,
      id: `pkg_${Date.now()}`,
      name: `${originalPackage.name} (Cópia)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      metrics: {
        ...originalPackage.metrics,
        totalSales: 0,
        totalRevenue: 0,
        monthlySales: 0,
        monthlyRevenue: 0,
        lastSale: undefined,
      },
    };

    dispatch({ type: 'ADD_PACKAGE', payload: duplicatedPackage });
    return duplicatedPackage;
  };

  return (
    <ServiceContext.Provider value={{
      state,
      dispatch,
      searchServices,
      searchPackages,
      validateService,
      validatePackage,
      updateServicePrice,
      generateServiceReport,
      generatePackageReport,
      duplicateService,
      duplicatePackage,
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useService() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useService must be used within a ServiceProvider');
  }
  return context;
}