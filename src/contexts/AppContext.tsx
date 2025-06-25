import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, Client, Barber, Service, Appointment, Payment, DashboardStats } from '../types';

interface AppState {
  currentUser: User | null;
  clients: Client[];
  barbers: Barber[];
  services: Service[];
  appointments: Appointment[];
  payments: Payment[];
  dashboardStats: DashboardStats;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'SET_BARBERS'; payload: Barber[] }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'SET_APPOINTMENTS'; payload: Appointment[] }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT'; payload: Appointment }
  | { type: 'SET_PAYMENTS'; payload: Payment[] }
  | { type: 'ADD_PAYMENT'; payload: Payment }
  | { type: 'SET_DASHBOARD_STATS'; payload: DashboardStats };

const initialState: AppState = {
  currentUser: null,
  clients: [],
  barbers: [],
  services: [],
  appointments: [],
  payments: [],
  dashboardStats: {
    todayRevenue: 0,
    todayAppointments: 0,
    monthRevenue: 0,
    monthAppointments: 0,
    activeClients: 0,
    averageTicket: 0,
    revenueGrowth: 0,
    appointmentGrowth: 0,
  },
  loading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, currentUser: action.payload };
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
      };
    case 'SET_BARBERS':
      return { ...state, barbers: action.payload };
    case 'SET_SERVICES':
      return { ...state, services: action.payload };
    case 'SET_APPOINTMENTS':
      return { ...state, appointments: action.payload };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT':
      return {
        ...state,
        appointments: state.appointments.map(appointment =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
      };
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    case 'ADD_PAYMENT':
      return { ...state, payments: [...state.payments, action.payload] };
    case 'SET_DASHBOARD_STATS':
      return { ...state, dashboardStats: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Simular carregamento inicial dos dados
    const loadInitialData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Dados mockados
      const mockUser: User = {
        id: '1',
        name: 'Admin',
        email: 'admin@barbearia.com',
        phone: '11999999999',
        role: 'admin',
        createdAt: new Date(),
      };

      const mockBarbers: Barber[] = [
        {
          id: 'b1',
          name: 'João Silva',
          email: 'joao@barbearia.com',
          phone: '11988887777',
          role: 'barber',
          specialties: ['Corte tradicional', 'Barba'],
          commissionRate: 0.6,
          workingHours: {
            monday: { start: '08:00', end: '18:00', available: true },
            tuesday: { start: '08:00', end: '18:00', available: true },
            wednesday: { start: '08:00', end: '18:00', available: true },
            thursday: { start: '08:00', end: '18:00', available: true },
            friday: { start: '08:00', end: '18:00', available: true },
            saturday: { start: '08:00', end: '16:00', available: true },
            sunday: { start: '08:00', end: '16:00', available: false },
          },
          rating: 4.8,
          totalRevenue: 15000,
          createdAt: new Date(),
        },
        {
          id: 'b2',
          name: 'Pedro Santos',
          email: 'pedro@barbearia.com',
          phone: '11977776666',
          role: 'barber',
          specialties: ['Corte moderno', 'Sobrancelha'],
          commissionRate: 0.5,
          workingHours: {
            monday: { start: '09:00', end: '19:00', available: true },
            tuesday: { start: '09:00', end: '19:00', available: true },
            wednesday: { start: '09:00', end: '19:00', available: true },
            thursday: { start: '09:00', end: '19:00', available: true },
            friday: { start: '09:00', end: '19:00', available: true },
            saturday: { start: '08:00', end: '16:00', available: true },
            sunday: { start: '08:00', end: '16:00', available: false },
          },
          rating: 4.6,
          totalRevenue: 12000,
          createdAt: new Date(),
        },
      ];

      const mockServices: Service[] = [
        {
          id: 's1',
          name: 'Corte de Cabelo',
          description: 'Corte tradicional ou moderno',
          duration: 30,
          price: 35,
          category: 'Cabelo',
          isActive: true,
        },
        {
          id: 's2',
          name: 'Barba',
          description: 'Aparar e modelar barba',
          duration: 20,
          price: 25,
          category: 'Barba',
          isActive: true,
        },
        {
          id: 's3',
          name: 'Corte + Barba',
          description: 'Pacote completo',
          duration: 45,
          price: 55,
          category: 'Combo',
          isActive: true,
        },
        {
          id: 's4',
          name: 'Sobrancelha',
          description: 'Design de sobrancelha',
          duration: 15,
          price: 15,
          category: 'Estética',
          isActive: true,
        },
      ];

      const mockClients: Client[] = [
        {
          id: 'c1',
          name: 'Carlos Oliveira',
          email: 'carlos@email.com',
          phone: '11955554444',
          role: 'client',
          preferences: {
            preferredBarber: 'b1',
            preferredServices: ['s1', 's2'],
            notes: 'Prefere corte baixo nas laterais',
          },
          loyaltyPoints: 150,
          totalSpent: 280,
          lastVisit: new Date('2024-01-10'),
          createdAt: new Date('2023-06-15'),
        },
        {
          id: 'c2',
          name: 'Marcos Lima',
          email: 'marcos@email.com',
          phone: '11944443333',
          role: 'client',
          preferences: {
            preferredBarber: 'b2',
            preferredServices: ['s3'],
            notes: 'Cliente pontual',
          },
          loyaltyPoints: 200,
          totalSpent: 440,
          lastVisit: new Date('2024-01-08'),
          createdAt: new Date('2023-08-20'),
        },
      ];

      const mockStats: DashboardStats = {
        todayRevenue: 280,
        todayAppointments: 8,
        monthRevenue: 8500,
        monthAppointments: 156,
        activeClients: 89,
        averageTicket: 42,
        revenueGrowth: 12.5,
        appointmentGrowth: 8.3,
      };

      dispatch({ type: 'SET_USER', payload: mockUser });
      dispatch({ type: 'SET_BARBERS', payload: mockBarbers });
      dispatch({ type: 'SET_SERVICES', payload: mockServices });
      dispatch({ type: 'SET_CLIENTS', payload: mockClients });
      dispatch({ type: 'SET_DASHBOARD_STATS', payload: mockStats });
      
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    loadInitialData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}