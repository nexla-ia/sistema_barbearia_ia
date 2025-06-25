import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  MapPin,
  Phone,
  Mail,
  Clock,
  Scissors,
  Sparkles,
  User,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { AuthModal } from '../Auth/AuthModal';
import { GoogleMap } from '../Maps/GoogleMap';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { label: 'início', id: 'home' },
  { label: 'serviços', id: 'services' },
  { label: 'sobre', id: 'about' },
  { label: 'localização', id: 'location' },
  { label: 'contato', id: 'contact' },
];

const services = [
  {
    icon: Scissors,
    title: 'Corte de Cabelo',
    description: 'Cortes modernos e tradicionais realizados com técnicas exclusivas.',
    price: 'A partir de R$ 35',
  },
  {
    icon: Scissors,
    title: 'Barba',
    description: 'Modelagem completa com toalha quente e produtos premium.',
    price: 'A partir de R$ 25',
  },
  {
    icon: Sparkles,
    title: 'Tratamentos',
    description: 'Hidratação, relaxamento e outros cuidados especiais.',
    price: 'A partir de R$ 40',
  },
  {
    icon: Sparkles,
    title: 'Coloração',
    description: 'Tintura profissional para realçar seu estilo.',
    price: 'A partir de R$ 60',
  },
  {
    icon: Sparkles,
    title: 'Design de Sobrancelhas',
    description: 'Realce o olhar com um design personalizado.',
    price: 'A partir de R$ 25',
  },
  {
    icon: Sparkles,
    title: 'Pacotes Especiais',
    description: 'Combos promocionais para cuidar do visual completo.',
    price: 'Consulte valores',
  },
];

export function LandingPage({ onAdminLogin }: { onAdminLogin?: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleBookingClick = () => {
    setBookingFormOpen(true);
  };

  const handleCTA = () => {
    if (isAuthenticated) {
      navigate('/client');
    } else {
      openAuthModal('register');
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else if (user?.role === 'employee') {
        navigate('/employee');
      } else {
        navigate('/client');
      }
    } else {
      openAuthModal('login');
    }
  };

  const openAuthModal = (view: 'login' | 'register') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
  };

  const visibleSlides = isMobile ? 1 : 3;
  const slideWidth = 100 / visibleSlides;
  const maxIndex = Math.max(0, services.length - visibleSlides);

  const nextService = () => {
    setCurrentServiceIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevService = () => {
    setCurrentServiceIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServiceIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      {/* Header/Navigation */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/90 shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
              <img
                src="/images/icon_trimmed_transparent_customcolor (1).png"
                alt="Barbernex logo"
                className="w-8 h-8"
              />
              <span className="ml-2 text-2xl font-bold tracking-wider">BARBER<span className="text-[#C4A747]">NEX</span></span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-white hover:text-[#C4A747] transition-colors uppercase tracking-wide text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleBookingClick}
              className="bg-[#C4A747] text-black px-4 py-2 rounded hover:bg-[#D4B757] transition-colors uppercase tracking-wide text-sm font-bold"
            >
              Agendar Demonstrativo
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'employee' ? '/employee' : '/client')}
                className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wide text-sm font-bold"
              >
                Minha Conta
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="border border-white text-white px-4 py-2 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wide text-sm font-bold"
              >
                Login / Cadastro
              </button>
            )}
          </nav>
          
          {/* Mobile Actions */}
          <div className="flex items-center md:hidden space-x-4">
            <button onClick={handleLoginClick} className="text-white">
              <User className="w-6 h-6" />
            </button>
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
          <div
            className={`md:hidden bg-[#1A1A1A] border-t border-[#333333] overflow-hidden transition-all duration-[350ms] ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-white hover:text-[#C4A747] transition-colors uppercase tracking-wide text-sm font-medium py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={handleBookingClick}
                className="bg-[#C4A747] text-black px-4 py-3 rounded hover:bg-[#D4B757] transition-colors uppercase tracking-wide text-sm font-bold"
              >
                Agendar Demonstrativo
              </button>
            </div>
          </div>
      </header>

      {/* Hero Banner */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        ></div>
        <div className="container mx-auto px-4 relative z-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            ESTILO & PRECISÃO
          </h1>
          <div className="w-24 h-1 bg-[#C4A747] mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Transforme seu visual com os melhores profissionais da cidade. Modelo de demonstração Nexla
            </p>
          <button 
            onClick={handleBookingClick}
            className="bg-[#C4A747] text-black px-8 py-4 rounded text-lg font-bold hover:bg-[#D4B757] transition-colors uppercase tracking-wide"
          >
            Agende um demonstrativo
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">NOSSOS SERVIÇOS</h2>
            <div className="w-24 h-1 bg-[#C4A747] mx-auto"></div>
          </div>
          
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentServiceIndex * slideWidth}%)` }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                if (touchStartX !== null) {
                  const diff = e.changedTouches[0].clientX - touchStartX;
                  if (diff > 50) prevService();
                  if (diff < -50) nextService();
                }
              }}
              onMouseDown={(e) => setTouchStartX(e.clientX)}
              onMouseUp={(e) => {
                if (touchStartX !== null) {
                  const diff = e.clientX - touchStartX;
                  if (diff > 50) prevService();
                  if (diff < -50) nextService();
                }
              }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="min-w-full md:min-w-[33.333%] p-4"
                  onClick={handleBookingClick}
                >
                  <div className="bg-[#222222] p-8 rounded-lg transition-transform duration-300 hover:-translate-y-2 border border-[#333333] hover:border-[#C4A747] cursor-pointer group">
                    <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-[#C4A747] transition-colors">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-center">{service.title}</h3>
                    <p className="text-gray-400 mb-6 text-center">{service.description}</p>
                    <p className="text-[#C4A747] font-bold text-center text-xl">{service.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={prevService}
              className="hidden md:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 bg-[#C4A747] text-black p-2 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextService}
              className="hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 bg-[#C4A747] text-black p-2 rounded-full"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={handleCTA}
              className="border-2 border-[#C4A747] text-[#C4A747] px-8 py-3 rounded text-lg font-bold hover:bg-[#C4A747] hover:text-black transition-colors uppercase tracking-wide"
            >
              Ver todos os serviços
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-[#222222]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">SOBRE NÓS</h2>
              <div className="w-24 h-1 bg-[#C4A747] mb-6"></div>
              <p className="text-gray-300 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
              <p className="text-gray-300 mb-6">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  'Profissionais Certificados',
                  'Produtos Premium',
                  'Ambiente Exclusivo',
                  'Atendimento Personalizado'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-[#C4A747] rounded-full mr-2"></div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.pexels.com/photos/1319460/pexels-photo-1319460.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Barbearia interior" 
                className="rounded-lg h-64 w-full object-cover"
              />
              <img 
                src="https://images.pexels.com/photos/1570807/pexels-photo-1570807.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Serviço de barba" 
                className="rounded-lg h-64 w-full object-cover"
              />
              <img 
                src="https://images.pexels.com/photos/2076930/pexels-photo-2076930.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Corte de cabelo" 
                className="rounded-lg h-64 w-full object-cover"
              />
              <img 
                src="https://images.pexels.com/photos/897262/pexels-photo-897262.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Produtos de barbearia" 
                className="rounded-lg h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Location Section */}
      <section id="location" className="py-20 bg-[#1A1A1A]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Hours */}
            <div>
              <h2 className="text-3xl font-bold mb-4">HORÁRIOS DE FUNCIONAMENTO</h2>
              <div className="w-24 h-1 bg-[#C4A747] mb-6"></div>
              <div className="bg-[#222222] p-6 rounded-lg border border-[#333333]">
                <table className="w-full">
                  <tbody>
                    {[
                      { day: 'Segunda-feira', hours: '09:00 - 20:00' },
                      { day: 'Terça-feira', hours: '09:00 - 20:00' },
                      { day: 'Quarta-feira', hours: '09:00 - 20:00' },
                      { day: 'Quinta-feira', hours: '09:00 - 20:00' },
                      { day: 'Sexta-feira', hours: '09:00 - 20:00' },
                      { day: 'Sábado', hours: '09:00 - 18:00' },
                      { day: 'Domingo', hours: 'Fechado' }
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-[#333333] last:border-0">
                        <td className="py-3 font-medium">{item.day}</td>
                        <td className="py-3 text-right text-[#C4A747] font-bold">{item.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Location */}
            <div>
              <h2 className="text-3xl font-bold mb-4">LOCALIZAÇÃO</h2>
              <div className="w-24 h-1 bg-[#C4A747] mb-6"></div>
              <div className="bg-[#222222] p-6 rounded-lg border border-[#333333] mb-6">
                <div className="flex items-start mb-4">
                  <MapPin className="w-5 h-5 text-[#C4A747] mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <p className="font-medium">Rua Exemplo, 123</p>
                    <p className="text-gray-400">Bairro Central, Cidade - XX</p>
                    <p className="text-gray-400">CEP: 00000-000</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                  <p className="ml-3 font-medium">(00) 00000-0000</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                  <p className="ml-3 font-medium">contato@exemplo.com</p>
                </div>
              </div>
              <GoogleMap height="256px" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="py-20 bg-[#222222] relative">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1570806/pexels-photo-1570806.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
        ></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Que tal transformar sua barbearia com um sistema de IA de última geração?</h2>
            <div className="w-24 h-1 bg-[#C4A747] mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-8">
              Agende um demonstrativo agora e experimente o melhor serviço de barbearia com integração com IA.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleBookingClick}
                className="bg-[#C4A747] text-black px-8 py-4 rounded hover:bg-[#D4B757] transition-colors text-center"
              >
                <span className="block text-lg font-bold uppercase tracking-wide">
                  Agendar Demonstrativo
                </span>
                <span className="block text-xs sm:text-sm italic">
                  Teste nosso demo e agende online de qualquer dispositivo (mobile e desktop)
                </span>
              </button>
              <a
                href="https://wa.me/556999300101"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded text-lg font-bold hover:bg-white hover:text-black transition-colors uppercase tracking-wide text-center"
              >
                Contato via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Booking Form Modal */}
      {bookingFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#222222] rounded-lg p-6 max-w-md w-full border border-[#333333]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Agendar Demonstrativo</h3>
              <button onClick={() => setBookingFormOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nome completo</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Telefone</label>
                <input 
                  type="tel" 
                  className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
                  placeholder="seu@email.com"
                />
              </div>
              
              
              <button
                type="submit"
                className="w-full bg-[#C4A747] text-black py-3 rounded font-bold hover:bg-[#D4B757] transition-colors"
              >
                Confirmar Demonstração
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login/Register Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialView={authModalView}
      />
    </div>
  );
}
