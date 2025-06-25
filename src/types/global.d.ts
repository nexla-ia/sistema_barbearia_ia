// Type definitions for Google Maps API
declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
        Geocoder: any;
        Animation: {
          DROP: number;
        };
        Point: any;
        Size: any;
      };
    };
  }
}

export {};