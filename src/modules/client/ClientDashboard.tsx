import React, { useState, FC } from 'react';
import { Calendar, Clock, User, Scissors, History, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BookingModal } from './BookingModal';
import { AppointmentsModal } from './AppointmentsModal';
import { ProfileModal } from './ProfileModal';
import { HistoryModal } from './HistoryModal';

export const ClientDashboard: FC = () => {
  const { user, logout } = useAuth();
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [isAppointmentsOpen, setAppointmentsOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isHistoryOpen, setHistoryOpen] = useState(false);

  const quickActions = [
    {
      key: 'booking',
      label: 'Agendar',
      desc: 'Marque um novo horário',
      icon: <Calendar className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-100',
      onClick: () => setBookingOpen(true),
    },
    {
      key: 'appointments',
      label: 'Meus Agendamentos',
      desc: 'Visualize ou cancele',
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-100',
      onClick: () => setAppointmentsOpen(true),
    },
    {
      key: 'profile',
      label: 'Meu Perfil',
      desc: 'Atualize suas informações',
      icon: <User className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-100',
      onClick: () => setProfileOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')">      
      <div className="min-h-screen bg-black/50 backdrop-blur-md text-white px-6 lg:px-12 flex flex-col gap-6 max-w-5xl mx-auto">
        {/* Welcome Section */}
        <section className="bg-gray-800 rounded-xl shadow-lg border border-amber-500 p-6">
          <h1 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name || 'Cliente'}!</h1>
          <p className="text-gray-300">Gerencie seus agendamentos e acompanhe seu histórico de serviços.</p>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map(action => (
            <button
              key={action.key}
              onClick={action.onClick}
              className="bg-gray-800 rounded-xl shadow-lg border border-amber-500 p-6 hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex items-center space-x-4">
                <div className={`${action.bg} p-3 rounded-full`}>{action.icon}</div>
                <div>
                  <h3 className="font-semibold">{action.label}</h3>
                  <p className="text-sm text-gray-300">{action.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </section>

        {/* Próximos Agendamentos */}
        <section className="bg-gray-800 rounded-xl shadow-lg border border-amber-500 p-6">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          {/* TODO: Mapear lista de agendamentos reais */}
        </section>

        {/* Histórico de Serviços */}
        <section className="bg-gray-800 rounded-xl shadow-lg border border-amber-500 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Histórico de Serviços</h2>
            <button onClick={() => setHistoryOpen(true)} className="text-sm text-amber-500 hover:text-amber-400">
              Ver Mais
            </button>
          </div>
          {/* TODO: Mapear histórico real de serviços */}
        </section>

        {/* Loyalty Program */}
        {/* ... similares ao código original, extraído para outro componente se desejar ... */}

        <div className="mt-auto flex justify-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow hover:from-red-600 hover:to-red-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Modals */}
        <BookingModal isOpen={isBookingOpen} onClose={() => setBookingOpen(false)} />
        <AppointmentsModal isOpen={isAppointmentsOpen} onClose={() => setAppointmentsOpen(false)} />
        <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} />
        <HistoryModal isOpen={isHistoryOpen} onClose={() => setHistoryOpen(false)} />
      </div>
    </div>
  );
};
