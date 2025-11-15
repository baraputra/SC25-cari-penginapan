import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { type Accommodation } from '../types';

// Fix for default icon issue when using module bundlers
// This ensures that the marker icons are loaded correctly from the CDN
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapViewProps {
  accommodations: Accommodation[];
  center: {
    lat: number;
    lng: number;
  };
}

const MapView: React.FC<MapViewProps> = ({ accommodations, center }) => {
  const accommodationsWithCoords = accommodations.filter(
    (acc) => acc.latitude != null && acc.longitude != null && !isNaN(acc.latitude) && !isNaN(acc.longitude)
  );

  if (accommodationsWithCoords.length === 0) {
    return null; // Don't render the map if no accommodations have valid coordinates
  }

  return (
    <div className="mb-8">
        <MapContainer center={[center.lat, center.lng]} zoom={13} scrollWheelZoom={false} className="leaflet-container">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {accommodationsWithCoords.map((acc, index) => (
            <Marker key={`${acc.nama}-${index}`} position={[acc.latitude!, acc.longitude!]}>
              <Popup>
                <div className="font-bold">{acc.nama}</div>
                <div>{acc.alamat}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
    </div>
  );
};

export default MapView;
