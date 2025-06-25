import React from 'react';

interface GoogleMapProps {
  address: string;
  zoom?: number;
  height?: string;
}

export function GoogleMap({ address, height = '400px' }: GoogleMapProps) {
  return (
    <div 
      className="w-full rounded-lg overflow-hidden shadow-md bg-slate-100 flex items-center justify-center" 
      style={{ height }}
      aria-label="Mapa mostrando a localização da barbearia"
    >
      <div className="text-center p-4">
        <p className="text-slate-600 mb-2">Mapa temporariamente indisponível</p>
        <p className="text-sm text-slate-500">{address}</p>
      </div>
    </div>
  );
}