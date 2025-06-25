import React from 'react';

interface GoogleMapProps {
  height?: string;
}

export function GoogleMap({ height = '400px' }: GoogleMapProps) {
  const src = 'https://maps.google.com/maps?q=0,0&z=1&output=embed';

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