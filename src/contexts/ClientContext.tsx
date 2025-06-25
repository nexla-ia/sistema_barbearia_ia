import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ClientProfile, ClientSearchFilters, CommunicationTemplate, ScheduledMessage } from '../types/client';

interface ClientState {
  clients: ClientProfile[];
  selectedClient: ClientProfile | null;
  searchFilters: ClientSearchFilters;
  communicationTemplates: CommunicationTemplate[];
  scheduledMessages: ScheduledMessage[];
  loading: boolean;
  error: string | null;
}

type ClientAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CLIENTS'; payload: ClientProfile[] }
  | { type: 'ADD_CLIENT'; payload: ClientProfile }
  | { type: 'UPDATE_CLIENT'; payload: ClientProfile }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SET_SELECTED_CLIENT'; payload: ClientProfile | null }
  | { type: 'SET_SEARCH_FILTERS'; payload: ClientSearchFilters }
  | { type: 'SET_COMMUNICATION_TEMPLATES'; payload: CommunicationTemplate[] }
  | { type: 'SET_SCHEDULED_MESSAGES'; payload: ScheduledMessage[] };

const initialState: ClientState = {
  clients: [],
  selectedClient: null,
  searchFilters: {},
  communicationTemplates: [],
  scheduledMessages: [],
  loading: false,
  error: null,
};

function clientReducer(state: ClientState, action: ClientAction): ClientState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
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
        selectedClient: state.selectedClient?.id === action.payload.id ? action.payload : state.selectedClient,
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        selectedClient: state.selectedClient?.id === action.payload ? null : state.selectedClient,
      };
    case 'SET_SELECTED_CLIENT':
      return { ...state, selectedClient: action.payload };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_COMMUNICATION_TEMPLATES':
      return { ...state, communicationTemplates: action.payload };
    case 'SET_SCHEDULED_MESSAGES':
      return { ...state, scheduledMessages: action.payload };
    default:
      return state;
  }
}

const ClientContext = createContext<{
  state: ClientState;
  dispatch: React.Dispatch<ClientAction>;
  searchClients: (filters: ClientSearchFilters) => ClientProfile[];
  getLoyaltyLevel: (points: number) => 'bronze' | 'silver' | 'gold' | 'platinum';
  calculateNextLevelPoints: (currentPoints: number, currentLevel: string) => number;
  addPointsToClient: (clientId: string, points: number, description: string) => void;
  exportClientData: (clientId: string) => Promise<Blob>;
  sendMessage: (clientId: string, templateId: string, variables: Record<string, string>) => Promise<void>;
} | null>(null);

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(clientReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Mock data - in production, this would come from your API
      const mockClients: ClientProfile[] = [
        {
          id: 'c1',
          fullName: 'Maria Silva Santos',
          phone: '11987654321',
          email: 'maria.silva@email.com',
          birthDate: new Date('1985-03-15'),
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apto 45',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
          },
          cpf: '123.456.789-00',
          photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          documents: [],
          termsAccepted: [
            {
              id: 't1',
              termType: 'privacy_policy',
              version: '1.0',
              acceptedAt: new Date('2024-01-01'),
              ipAddress: '192.168.1.1',
            },
          ],
          preferences: {
            favoriteServices: ['s1', 's3'],
            preferredProfessional: 'b1',
            specialNotes: 'Prefere horários pela manhã',
            allergies: ['Níquel'],
            restrictions: [],
            preferredFrequency: 'monthly',
            preferredTimeSlots: ['09:00', '10:00', '11:00'],
            preferredDays: [1, 2, 3, 4, 5], // Segunda a sexta
          },
          loyaltyProgram: {
            currentPoints: 450,
            totalPointsEarned: 1200,
            totalPointsRedeemed: 750,
            currentLevel: 'silver',
            nextLevelPoints: 550,
            benefits: [
              {
                id: 'b1',
                type: 'discount',
                description: '10% de desconto em todos os serviços',
                value: 10,
                isActive: true,
              },
            ],
            pointsHistory: [
              {
                id: 'p1',
                type: 'earned',
                points: 55,
                description: 'Corte + Escova',
                relatedServiceId: 'sr1',
                createdAt: new Date('2024-01-10'),
              },
            ],
          },
          serviceHistory: [
            {
              id: 'sr1',
              serviceId: 's1',
              serviceName: 'Corte + Escova',
              professionalId: 'b1',
              professionalName: 'Ana Costa',
              date: new Date('2024-01-10'),
              duration: 60,
              price: 55,
              finalPrice: 55,
              status: 'completed',
              pointsEarned: 55,
            },
          ],
          productHistory: [],
          feedbackHistory: [
            {
              id: 'f1',
              serviceId: 'sr1',
              rating: 5,
              comment: 'Excelente atendimento! Adorei o resultado.',
              professionalRating: 5,
              serviceRating: 5,
              facilityRating: 5,
              wouldRecommend: true,
              createdAt: new Date('2024-01-10'),
              isPublic: true,
            },
          ],
          photoGallery: [],
          communicationPreferences: {
            whatsapp: true,
            email: true,
            sms: false,
            phone: false,
            marketingConsent: true,
            reminderPreference: '1_day',
            birthdayMessages: true,
            promotionalMessages: true,
          },
          createdAt: new Date('2023-06-15'),
          updatedAt: new Date('2024-01-10'),
          lastVisit: new Date('2024-01-10'),
          totalSpent: 1200,
          visitCount: 22,
          status: 'active',
          lgpdConsent: {
            dataProcessingConsent: true,
            marketingConsent: true,
            dataRetentionPeriod: 5,
            consentDate: new Date('2023-06-15'),
            lastUpdated: new Date('2023-06-15'),
            dataPortabilityRequests: [],
            deletionRequests: [],
          },
        },
        {
          id: 'c2',
          fullName: 'Ana Paula Oliveira',
          phone: '11976543210',
          email: 'ana.paula@email.com',
          birthDate: new Date('1990-07-22'),
          photo: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          documents: [],
          termsAccepted: [],
          preferences: {
            favoriteServices: ['s2', 's4'],
            preferredProfessional: 'b2',
            specialNotes: 'Cabelo sensível, usar produtos hipoalergênicos',
            allergies: ['Parafenilenodiamina'],
            restrictions: ['Não usar produtos com amônia'],
            preferredFrequency: 'biweekly',
            preferredTimeSlots: ['14:00', '15:00', '16:00'],
            preferredDays: [2, 4, 6], // Terça, quinta e sábado
          },
          loyaltyProgram: {
            currentPoints: 180,
            totalPointsEarned: 380,
            totalPointsRedeemed: 200,
            currentLevel: 'bronze',
            nextLevelPoints: 320,
            benefits: [],
            pointsHistory: [],
          },
          serviceHistory: [],
          productHistory: [],
          feedbackHistory: [],
          photoGallery: [],
          communicationPreferences: {
            whatsapp: true,
            email: false,
            sms: true,
            phone: false,
            marketingConsent: false,
            reminderPreference: '2_hours',
            birthdayMessages: true,
            promotionalMessages: false,
          },
          createdAt: new Date('2023-09-20'),
          updatedAt: new Date('2024-01-05'),
          lastVisit: new Date('2024-01-05'),
          totalSpent: 380,
          visitCount: 8,
          status: 'active',
          lgpdConsent: {
            dataProcessingConsent: true,
            marketingConsent: false,
            dataRetentionPeriod: 3,
            consentDate: new Date('2023-09-20'),
            lastUpdated: new Date('2023-09-20'),
            dataPortabilityRequests: [],
            deletionRequests: [],
          },
        },
      ];

      const mockTemplates: CommunicationTemplate[] = [
        {
          id: 'tmpl1',
          name: 'Boas-vindas',
          type: 'welcome',
          channel: 'whatsapp',
          content: 'Olá {{nome}}! Bem-vinda ao nosso salão! 💄✨',
          variables: ['nome'],
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'tmpl2',
          name: 'Lembrete de Agendamento',
          type: 'reminder',
          channel: 'whatsapp',
          content: 'Oi {{nome}}! Lembrete: você tem agendamento amanhã às {{horario}} com {{profissional}}. Confirma? 😊',
          variables: ['nome', 'horario', 'profissional'],
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: 'tmpl3',
          name: 'Aniversário',
          type: 'birthday',
          channel: 'whatsapp',
          content: '🎉 Parabéns, {{nome}}! Que tal comemorar com um desconto especial de 20% em qualquer serviço? 🎂',
          variables: ['nome'],
          isActive: true,
          createdAt: new Date(),
        },
      ];

      dispatch({ type: 'SET_CLIENTS', payload: mockClients });
      dispatch({ type: 'SET_COMMUNICATION_TEMPLATES', payload: mockTemplates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load client data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const searchClients = (filters: ClientSearchFilters): ClientProfile[] => {
    return state.clients.filter(client => {
      if (filters.name && !client.fullName.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }
      if (filters.phone && !client.phone.includes(filters.phone)) {
        return false;
      }
      if (filters.email && !client.email.toLowerCase().includes(filters.email.toLowerCase())) {
        return false;
      }
      if (filters.lastVisitFrom && client.lastVisit && client.lastVisit < filters.lastVisitFrom) {
        return false;
      }
      if (filters.lastVisitTo && client.lastVisit && client.lastVisit > filters.lastVisitTo) {
        return false;
      }
      if (filters.totalSpentMin && client.totalSpent < filters.totalSpentMin) {
        return false;
      }
      if (filters.totalSpentMax && client.totalSpent > filters.totalSpentMax) {
        return false;
      }
      if (filters.loyaltyLevel && !filters.loyaltyLevel.includes(client.loyaltyProgram.currentLevel)) {
        return false;
      }
      if (filters.status && !filters.status.includes(client.status)) {
        return false;
      }
      if (filters.hasAllergies !== undefined) {
        const hasAllergies = client.preferences.allergies.length > 0;
        if (filters.hasAllergies !== hasAllergies) {
          return false;
        }
      }
      if (filters.birthdayMonth !== undefined) {
        const birthMonth = client.birthDate.getMonth() + 1;
        if (filters.birthdayMonth !== birthMonth) {
          return false;
        }
      }
      return true;
    });
  };

  const getLoyaltyLevel = (points: number): 'bronze' | 'silver' | 'gold' | 'platinum' => {
    if (points >= 2000) return 'platinum';
    if (points >= 1000) return 'gold';
    if (points >= 500) return 'silver';
    return 'bronze';
  };

  const calculateNextLevelPoints = (currentPoints: number, currentLevel: string): number => {
    switch (currentLevel) {
      case 'bronze':
        return 500 - currentPoints;
      case 'silver':
        return 1000 - currentPoints;
      case 'gold':
        return 2000 - currentPoints;
      default:
        return 0;
    }
  };

  const addPointsToClient = (clientId: string, points: number, description: string) => {
    const client = state.clients.find(c => c.id === clientId);
    if (client) {
      const newPoints = client.loyaltyProgram.currentPoints + points;
      const newLevel = getLoyaltyLevel(newPoints);
      
      const updatedClient: ClientProfile = {
        ...client,
        loyaltyProgram: {
          ...client.loyaltyProgram,
          currentPoints: newPoints,
          totalPointsEarned: client.loyaltyProgram.totalPointsEarned + points,
          currentLevel: newLevel,
          nextLevelPoints: calculateNextLevelPoints(newPoints, newLevel),
          pointsHistory: [
            ...client.loyaltyProgram.pointsHistory,
            {
              id: `p_${Date.now()}`,
              type: 'earned',
              points,
              description,
              createdAt: new Date(),
            },
          ],
        },
        updatedAt: new Date(),
      };
      
      dispatch({ type: 'UPDATE_CLIENT', payload: updatedClient });
    }
  };

  const exportClientData = async (clientId: string): Promise<Blob> => {
    const client = state.clients.find(c => c.id === clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    const data = {
      ...client,
      exportedAt: new Date().toISOString(),
      exportReason: 'Solicitação de portabilidade de dados (LGPD)',
    };

    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  };

  const sendMessage = async (clientId: string, templateId: string, variables: Record<string, string>): Promise<void> => {
    const client = state.clients.find(c => c.id === clientId);
    const template = state.communicationTemplates.find(t => t.id === templateId);
    
    if (!client || !template) {
      throw new Error('Cliente ou template não encontrado');
    }

    // Simulate sending message
    console.log(`Sending ${template.channel} message to ${client.fullName}:`, {
      template: template.content,
      variables,
    });

    // In production, integrate with WhatsApp API, email service, etc.
  };

  return (
    <ClientContext.Provider value={{
      state,
      dispatch,
      searchClients,
      getLoyaltyLevel,
      calculateNextLevelPoints,
      addPointsToClient,
      exportClientData,
      sendMessage,
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
}