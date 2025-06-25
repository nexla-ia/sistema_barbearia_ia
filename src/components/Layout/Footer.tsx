import React from 'react';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-xl font-bold tracking-wider text-white">BARBER<span className="text-[#C4A747]">NEX</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              Transformando estilos e elevando a experiência de barbearia desde 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#C4A747] transition-colors">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#C4A747] transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#C4A747] transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-white">Serviços</h3>
            <ul className="space-y-2">
              {['Corte de Cabelo', 'Barba', 'Sobrancelha', 'Tratamentos', 'Coloração', 'Combos'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-[#C4A747] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-white">Links Úteis</h3>
            <ul className="space-y-2">
              {['Início', 'Sobre Nós', 'Serviços', 'Galeria', 'Equipe', 'Contato'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-[#C4A747] transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 uppercase text-white">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-[#C4A747] mt-1 flex-shrink-0" />
                <span className="ml-3 text-gray-400">Av. Paulista, 1000, Bela Vista, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                <span className="ml-3 text-gray-400">(11) 99999-9999</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-[#C4A747] flex-shrink-0" />
                <span className="ml-3 text-gray-400">contato@barberpro.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#333333] mt-8 pt-6 text-center">
          <p className="text-gray-500">
            &copy; 2025 BarberPro. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            Desenvolvido por NEXLA
          </p>
        </div>
      </div>
    </footer>
  );
}