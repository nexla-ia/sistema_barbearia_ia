import React from 'react';
import {
  Home, 
  Globe,
  Calendar, 
  CalendarDays,
  Users, 
  Scissors, 
  DollarSign, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import LogoutButton from '../Auth/LogoutButton';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'landing', label: 'Landing Page', icon: Globe },
  { id: 'appointments', label: 'Agendamentos', icon: Calendar },
  { id: 'calendar', label: 'Agenda', icon: CalendarDays },
  { id: 'booking', label: 'Reserva Online', icon: Globe },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'barbers', label: 'Profissionais', icon: Scissors },
  { id: 'services', label: 'Serviços', icon: Settings },
  { id: 'finances', label: 'Financeiro', icon: DollarSign },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold">BarberPro</h1>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  if (window.innerWidth < 1024) {
                    onToggle();
                  }
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive 
                    ? 'bg-amber-500 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="bg-slate-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">A</span>
              </div>
              <div>
                <p className="text-white font-medium">Admin</p>
                <p className="text-slate-400 text-sm">Proprietário</p>
              </div>
            </div>
            <div className="flex justify-end">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
