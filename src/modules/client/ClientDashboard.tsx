import React, { useState } from 'react';
import { Calendar, Clock, User, Scissors, History, Star, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BookingModal } from './BookingModal';
import { AppointmentsModal } from './AppointmentsModal';
import { ProfileModal } from './ProfileModal';
import { HistoryModal } from './HistoryModal';

export function ClientDashboard() {
  const { user, logout } = useAuth();
  const [showBooking, setShowBooking] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
      }}
    >
      <div className="min-h-screen bg-black/50 backdrop-blur-md text-white">
        <div className="space-y-6 p-6 lg:p-12 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-[#303030] text-white rounded-xl shadow-lg border border-amber-500 p-6">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo, {user?.name}!</h1>
        <p className="text-gray-300">Gerencie seus agendamentos e acompanhe seu histórico de serviços.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowBooking(true)}
          className="bg-[#303030] text-white rounded-xl shadow-lg border border-[#C4A747] p-6 hover:bg-[#404040] transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-amber-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold">Agendar</h3>
              <p className="text-sm">Marque um novo horário</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowAppointments(true)}
          className="bg-[#303030] text-white rounded-xl shadow-lg border border-[#C4A747] p-6 hover:bg-[#404040] transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Meus Agendamentos</h3>
              <p className="text-sm">Visualize ou cancele</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowProfile(true)}
          className="bg-[#303030] text-white rounded-xl shadow-lg border border-[#C4A747] p-6 hover:bg-[#404040] transition-colors text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold">Meu Perfil</h3>
              <p className="text-sm">Atualize suas informações</p>
            </div>
          </div>
        </button>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-[#303030] text-white rounded-xl shadow-lg border border-amber-500 p-6">
        <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500/20 p-3 rounded-full">
                <Scissors className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Corte + Barba</h3>
                <p className="text-sm text-gray-400">Hoje, 15:30 • João Silva</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600 text-white">
                Confirmado
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-amber-500/20 p-3 rounded-full">
                <Scissors className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Barba</h3>
                <p className="text-sm text-gray-400">15/07, 14:00 • Pedro Santos</p>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600 text-white">
                Pendente
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Service History */}
      <div className="bg-[#303030] text-white rounded-xl shadow-lg border border-amber-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Histórico de Serviços</h2>
          <button
            onClick={() => setShowHistory(true)}
            className="text-sm text-[#C4A747] hover:text-[#D4B757]"
          >
            Ver Mais
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-500/20 p-3 rounded-full">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium">Corte de Cabelo</h3>
                <p className="text-sm text-gray-400">01/07/2024 • João Silva</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">5.0</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="bg-slate-500/20 p-3 rounded-full">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <h3 className="font-medium">Corte + Barba</h3>
                <p className="text-sm text-gray-400">15/06/2024 • Pedro Santos</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Program */}
      <div className="bg-[#303030] text-white rounded-xl shadow-lg border border-amber-500 p-6">
        <h2 className="text-lg font-semibold mb-4">Programa de Fidelidade</h2>
        
      <div className="bg-gradient-to-r from-amber-700 to-amber-500 rounded-lg p-6 border border-amber-600 text-black">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Nível Bronze</h3>
              <p className="text-sm">150 pontos acumulados</p>
            </div>
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              150 pts
            </div>
          </div>
          
          <div className="w-full bg-amber-200 rounded-full h-2.5 mb-4">
            <div className="bg-amber-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
          </div>
          
          <p className="text-sm mb-4">Faltam 350 pontos para o próximo nível (Prata)</p>
          
          <div className="bg-gray-800 rounded-lg p-4 text-gray-200">
            <h4 className="font-medium mb-2">Benefícios Disponíveis</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>5% de desconto em todos os serviços</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                <span>Presente de aniversário</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg shadow hover:from-red-600 hover:to-red-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
      <BookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
      <AppointmentsModal
        isOpen={showAppointments}
        onClose={() => setShowAppointments(false)}
      />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </div>
    </div>
  );
}
