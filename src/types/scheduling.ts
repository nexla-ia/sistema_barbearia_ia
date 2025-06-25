export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  barberId?: string;
  appointmentId?: string;
}

export interface WorkingHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  endTime: string;
  isWorking: boolean;
  breakTimes?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface AppointmentBooking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  barberId: string;
  barberName: string;
  serviceIds: string[];
  services: Service[];
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  totalDuration: number; // in minutes
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  reminderSent: boolean;
  confirmationSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BarberAvailability {
  barberId: string;
  date: string;
  workingHours: {
    startTime: string;
    endTime: string;
  };
  blockedSlots: {
    startTime: string;
    endTime: string;
    reason: string;
  }[];
  appointments: AppointmentBooking[];
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  reminderTime: number; // hours before appointment
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  isActive: boolean;
  image?: string;
}

export interface Barber {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  rating: number;
  workingHours: WorkingHours[];
  isActive: boolean;
  commissionRate: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  preferences: {
    preferredBarber?: string;
    preferredServices: string[];
    notes: string;
  };
  loyaltyPoints: number;
  totalSpent: number;
  lastVisit?: Date;
  createdAt: Date;
}