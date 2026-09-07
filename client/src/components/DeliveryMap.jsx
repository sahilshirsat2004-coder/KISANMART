import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

// Custom Truck Marker Icon for Leaflet
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20]
});

// Helper component to auto-pan Leaflet map when coordinates change
function RecenterAutomatically({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function DeliveryMap({ orderId, initialCoords = { lat: 18.5204, lng: 73.8567 } }) {
  const [coords, setCoords] = useState(initialCoords);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Join isolated order room
    socket.emit('join_delivery_room', orderId);

    // Listen for coordinate updates from Driver
    socket.on('receive_location_update', (data) => {
      if (data && data.lat && data.lng) {
        setCoords({ lat: data.lat, lng: data.lng });
        setLastUpdated(new Date().toLocaleTimeString());
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs px-1 text-gray-500">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Live Freight Telematics (Order #{orderId.slice(-6).toUpperCase()})
        </span>
        {lastUpdated && <span>Updated: {lastUpdated}</span>}
      </div>

      <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-gray-200 relative z-0">
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[coords.lat, coords.lng]} icon={truckIcon}>
            <Popup>
              <div className="text-xs p-1 font-sans">
                <p className="font-bold text-gray-900">Freight Courier in Transit</p>
                <p className="text-gray-500">Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}</p>
              </div>
            </Popup>
          </Marker>
          <RecenterAutomatically lat={coords.lat} lng={coords.lng} />
        </MapContainer>
      </div>
    </div>
  );
}