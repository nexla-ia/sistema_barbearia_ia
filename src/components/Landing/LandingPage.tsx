import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, MapPin, Phone, Mail, Clock, Scissors, Sparkles } from 'lucide-react';
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

export function LandingPage({ onAdminLogin }: { onAdminLogin?: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');
  const [bookingFormOpen, setBookingFormOpen] = useState(false);
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
              <Scissors className="w-8 h-8 text-[#C4A747]" />
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
              Agendar
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
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-[#1A1A1A] border-t border-[#333333]">
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
                Agendar
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'employee' ? '/employee' : '/client')}
                  className="border border-white text-white px-4 py-3 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wide text-sm font-bold"
                >
                  Minha Conta
                </button>
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal('login')}
                    className="border border-white text-white px-4 py-3 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-wide text-sm font-bold"
                  >
                    Login / Cadastro
                  </button>
                </>
              )}
            </div>
          </div>
        )}
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
            Agende seu horário
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Scissors, 
                title: 'Corte de Cabelo', 
                description: 'Cortes modernos e tradicionais realizados com técnicas exclusivas.',
                price: 'A partir de R$ 35'
              },
              { 
                icon: Scissors, 
                title: 'Barba', 
                description: 'Modelagem completa com toalha quente e produtos premium.',
                price: 'A partir de R$ 25'
              },
              { 
                icon: Sparkles, 
                title: 'Tratamentos', 
                description: 'Hidratação, relaxamento e outros cuidados especiais.',
                price: 'A partir de R$ 40'
              }
            ].map((service, index) => (
              <div 
                key={index}
                className="bg-[#222222] p-8 rounded-lg transition-transform duration-300 hover:-translate-y-2 border border-[#333333] hover:border-[#C4A747] group"
              >
                <div className="w-16 h-16 bg-[#333333] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-[#C4A747] transition-colors">
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-center">{service.title}</h3>
                <p className="text-gray-400 mb-6 text-center">{service.description}</p>
                <p className="text-[#C4A747] font-bold text-center text-xl">{service.price}</p>
              </div>
            ))}
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
                Fundada em 2015, a BarberPro nasceu da paixão por transformar a experiência tradicional de barbearia em algo extraordinário. Nossa missão é oferecer serviços de alta qualidade em um ambiente sofisticado e acolhedor.
              </p>
              <p className="text-gray-300 mb-6">
                Contamos com uma equipe de profissionais altamente qualificados, constantemente atualizados com as últimas tendências e técnicas do mercado. Utilizamos produtos premium e equipamentos de ponta para garantir resultados impecáveis.
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
              <button
                onClick={handleCTA}
                className="bg-[#C4A747] text-black px-6 py-3 rounded font-bold hover:bg-[#D4B757] transition-colors uppercase tracking-wide text-sm"
              >
                Conheça nossa história
              </button>
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
              <h2 className="text-3xl font-bold mb-4">HORÁRIOS</h2>
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
                    <p className="font-medium">Av. Paulista, 1000</p>
                    <p className="text-gray-400">Bela Vista, São Paulo - SP</p>
                    <p className="text-gray-400">CEP: 01310-100</p>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <Phone className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                  <p className="ml-3 font-medium">(11) 99999-9999</p>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                  <p className="ml-3 font-medium">contato@barberpro.com.br</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PRONTO PARA TRANSFORMAR SEU VISUAL?</h2>
            <div className="w-24 h-1 bg-[#C4A747] mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 mb-8">
              Agende seu horário agora e experimente o melhor serviço de barbearia da cidade.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleBookingClick}
                className="bg-[#C4A747] text-black px-8 py-4 rounded text-lg font-bold hover:bg-[#D4B757] transition-colors uppercase tracking-wide"
              >
                Agendar online
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
              <h3 className="text-xl font-bold">Agendar Horário</h3>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Serviço</label>
                <select className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white">
                  <option value="">Selecione um serviço</option>
                  <option value="corte">Corte de Cabelo</option>
                  <option value="barba">Barba</option>
                  <option value="combo">Corte + Barba</option>
                  <option value="outros">Outros serviços</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Data</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Horário</label>
                  <select className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white">
                    <option value="">Selecione</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Observações (opcional)</label>
                <textarea 
                  className="w-full px-4 py-2 bg-[#333333] border border-[#444444] rounded focus:outline-none focus:ring-2 focus:ring-[#C4A747] text-white"
                  rows={3}
                  placeholder="Alguma informação adicional?"
                ></textarea>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-[#C4A747] text-black py-3 rounded font-bold hover:bg-[#D4B757] transition-colors"
              >
                Confirmar Agendamento
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