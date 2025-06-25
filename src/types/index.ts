export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'barber' | 'client';
  avatar?: string;
  createdAt: Date;
}

export interface Client extends User {
  role: 'client';
  preferences: {
    preferredBarber?: string;
    preferredServices: string[];
    notes: string;
  };
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit?: Date;
}

export interface Barber extends User {
  role: 'barber';
  specialties: string[];
  commissionRate: number;
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  rating: number;
  totalRevenue: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // em minutos
  price: number;
  category: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceIds: string[];
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalPrice: number;
  notes?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
}

export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  method: 'cash' | 'card' | 'pix';
  status: 'pending' | 'completed' | 'refunded';
  commission: number;
  createdAt: Date;
}

export interface DashboardStats {
  todayRevenue: number;
  todayAppointments: number;
  monthRevenue: number;
  monthAppointments: number;
  activeClients: number;
  averageTicket: number;
  revenueGrowth: number;
  appointmentGrowth: number;
}