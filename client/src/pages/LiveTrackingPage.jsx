import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { io } from 'socket.io-client';
import api from '../api/axios';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

// Custom Leaflet Delivery Truck Icon
const deliveryTruckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22]
});

// Safely formats string or object address: { city, state, pincode }
const formatAddress = (addr, fallback = 'Sindhudurg, Maharashtra') => {
  if (!addr) return fallback;
  if (typeof addr === 'string') return addr;
  const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
};

// Auto-center map on new coordinate arrival
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);
  return null;
}

export default function LiveTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [coords, setCoords] = useState({ lat: 15.9042, lng: 73.8180 }); // Sawantwadi default
  const [lastPing, setLastPing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        const found = (res.data.orders || []).find((o) => o._id === orderId || o._id.slice(-12) === orderId);
        if (found) {
          setOrder(found);
          if (found.liveDriverLocation?.coordinates) {
            setCoords({
              lat: found.liveDriverLocation.coordinates[1],
              lng: found.liveDriverLocation.coordinates[0]
            });
          }
        }
      } catch (err) {
        console.error('Failed to load tracking order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();

    // Connects to Render in production, localhost in development
    const socketServerUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const socket = io(socketServerUrl);

    socket.emit('join_delivery_room', orderId);

    socket.on('receive_location_update', (data) => {
      if (data && data.lat && data.lng) {
        setCoords({ lat: data.lat, lng: data.lng });
        setLastPing(new Date().toLocaleTimeString());
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400">
                  #KM{orderId ? orderId.slice(-8).toUpperCase() : 'TRACK'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Dispatch
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Live Delivery Tracking
              </h1>
            </div>
          </div>

          {lastPing && (
            <div className="bg-white px-4 py-2 rounded-2xl border border-emerald-100 shadow-xs text-xs font-semibold text-slate-600 flex items-center gap-2 self-start sm:self-auto">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Last Coordinate Ping: <strong className="text-slate-900">{lastPing}</strong></span>
            </div>
          )}
        </div>

        {/* Main Grid: Map + Dispatch Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map View Box */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm relative z-0 min-h-[420px] sm:min-h-[520px]">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full min-h-[420px] sm:min-h-[520px]"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lng]} icon={deliveryTruckIcon}>
                <Popup>
                  <div className="text-xs p-1 font-sans">
                    <p className="font-bold text-slate-900">Courier Vehicle in Transit</p>
                    <p className="text-slate-500">Lat: {coords.lat.toFixed(4)}, Lng: {coords.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
              <RecenterMap lat={coords.lat} lng={coords.lng} />
            </MapContainer>
          </div>

          {/* Dispatch Sidebar Details */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Courier Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Assigned Driver
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Verified Partner
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-base border border-blue-100">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {order?.driver?.name || 'Local Freight Driver'}
                  </h3>
                  <p className="text-xs text-slate-400">Rural Logistics Network</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Contact Courier:</span>
                <a
                  href={`tel:${order?.driver?.phone || '9876543210'}`}
                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{order?.driver?.phone || '+91 98765 43210'}</span>
                </a>
              </div>
            </div>

            {/* Transit Route Stops */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Transit Stops
              </span>

              {/* Stop 1: Pickup */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Farm Origin (Pickup)</span>
                  <p className="text-xs font-extrabold text-slate-800">{order?.farmer?.name || 'Local Farm'}</p>
                  <p className="text-[11px] text-slate-500">{formatAddress(order?.farmer?.address, 'Sawantwadi, Sindhudurg')}</p>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-slate-200 ml-3.5"></div>

              {/* Stop 2: Drop-off */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Retail Drop-off</span>
                  <p className="text-xs font-extrabold text-slate-800">{order?.buyer?.name || 'Retail Shop'}</p>
                  <p className="text-[11px] text-slate-500">{formatAddress(order?.deliveryAddress || order?.buyer?.address, 'Kudal, Sindhudurg')}</p>
                </div>
              </div>
            </div>

            {/* Order Cargo Summary */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2 text-xs">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Cargo Item
              </span>
              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-800">{order?.product?.name || 'Fresh Produce'}</span>
                <span className="font-mono text-slate-500">{order?.quantity || 10} kg</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100">
                <span>Status:</span>
                <span className="font-extrabold text-emerald-700">{order?.status || 'IN_TRANSIT'}</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}