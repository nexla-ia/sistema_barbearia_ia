import React from 'react';

interface GoogleMapProps {
  address: string;
  zoom?: number;
  height?: string;
}

export function GoogleMap({ address, zoom = 15, height = '400px' }: GoogleMapProps) {
  const encoded = encodeURIComponent(address);
  const src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA6AaE8UvYVVif1Pm2b64sf7dN13EUayOw&q=${encoded}&zoom=${zoom}`;

  return (
    <iframe
      title="Localização da barbearia"
      className="w-full rounded-lg border-0"
      style={{ height }}
      loading="lazy"
      allowFullScreen
      src={src}
    />
  );
}