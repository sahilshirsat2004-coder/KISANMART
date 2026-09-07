import { useState, useEffect } from 'react';
import api from '../api/axios';
import { io } from 'socket.io-client';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Phone, 
  Radio, 
  Plus, 
  Check, 
  Clock 
} from 'lucide-react';

let socket;

export default function DriverDashboard() {
  const [vehicleStatus, setVehicleStatus] = useState('Available');
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [activeDelivery, setActiveDelivery] = useState(null);
  const [notification, setNotification] = useState('');
  const [isTransmitting, setIsTransmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [availRes, myRes] = await Promise.all([
        api.get('/orders/driver/available'),
        api.get('/orders/my-orders')
      ]);
      const available = availRes.data.orders || [];
      const mine = myRes.data.orders || [];

      setAvailableOrders(available);
      setMyOrders(mine);

      // Find active delivery in transit or assigned
      const current = mine.find((o) => ['DRIVER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT'].includes(o.status));
      setActiveDelivery(current || null);
    } catch (err) {
      console.error('Failed to load driver routes:', err);
    }
  };

  useEffect(() => {
    fetchData();
    socket = io('http://localhost:5000');
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/accept`);
      setNotification('Delivery assigned to your route!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim delivery');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Status transition failed');
    }
  };

  const handleTransmitGPS = (orderId) => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    setIsTransmitting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        socket.emit('send_location_update', {
          orderId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setNotification(`GPS sent: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setIsTransmitting(false);
      },
      () => {
        // Simulated GPS offset
        const lat = 15.9042 + (Math.random() - 0.5) * 0.02;
        const lng = 73.8180 + (Math.random() - 0.5) * 0.02;
        socket.emit('send_location_update', { orderId, lat, lng });
        setNotification(`Simulated GPS ping broadcasted!`);
        setIsTransmitting(false);
      }
    );
  };

  const completed = myOrders.filter((o) => o.status === 'DELIVERED');
  const todayEarnings = completed.reduce((sum, o) => sum + (o.totalAmount * 0.1 || 150), 0);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner & Vehicle Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-slate-400 font-medium">Delivery Partner</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            Delivery Dashboard 🚚
          </h1>
          <p className="text-xs text-slate-500">Find nearby orders and earn by delivering fresh produce.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Vehicle Status</span>
          <select
            value={vehicleStatus}
            onChange={(e) => setVehicleStatus(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Offline">Offline</option>
          </select>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification('')} className="text-emerald-700 font-bold">✕</button>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Available Orders</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{availableOrders.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Active Deliveries</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{activeDelivery ? 1 : 0}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Completed</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{completed.length}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] text-slate-400 font-medium">Today's Earnings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹{todayEarnings}</div>
        </div>
      </div>

      {/* ACTIVE DELIVERY BOX (Matching Screenshot 4) */}
      {activeDelivery && (
        <div className="rounded-2xl border border-blue-300 overflow-hidden shadow-sm bg-white">
          <div className="bg-blue-600 px-5 py-3 text-white flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">ACTIVE DELIVERY</span>
              <span className="text-xs font-mono font-bold">Order #KM{activeDelivery._id.slice(-10).toUpperCase()}</span>
            </div>
            <Truck className="w-5 h-5 text-white/80" />
          </div>

          <div className="p-5 space-y-6">
            {/* Route Stops Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block uppercase">STOP 1</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">{activeDelivery.farmer?.name}</p>
                <p className="text-[11px] text-slate-500">{activeDelivery.farmer?.address?.city || 'Sawantwadi, Sindhudurg'}</p>
              </div>

              <div className="text-center text-xs text-blue-600 font-medium flex flex-col items-center justify-center">
                <Navigation className="w-4 h-4 rotate-90 text-blue-500" />
                <span className="text-[10px] text-slate-400 mt-1">Delivery Route</span>
              </div>

              <div className="text-left md:text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">STOP 2</span>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1 md:justify-end">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> Drop-off
                </span>
                <p className="text-xs font-bold text-slate-900 mt-1">{activeDelivery.buyer?.name || 'Shopkeeper'}</p>
                <p className="text-[11px] text-slate-500">{activeDelivery.buyer?.address?.city || 'Kudal, Sindhudurg'}</p>
              </div>
            </div>

            {/* Stepper Status Buttons */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Update Delivery Status</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleUpdateStatus(activeDelivery._id, 'DRIVER_ASSIGNED')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    activeDelivery.status === 'DRIVER_ASSIGNED'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  ✓ Vehicle Assigned
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeDelivery._id, 'PICKED_UP')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    activeDelivery.status === 'PICKED_UP'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Picked Up
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeDelivery._id, 'IN_TRANSIT')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    activeDelivery.status === 'IN_TRANSIT'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  In Transit
                </button>

                <button
                  onClick={() => handleUpdateStatus(activeDelivery._id, 'DELIVERED')}
                  className="py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition"
                >
                  Delivered
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTransmitGPS(activeDelivery._id)}
                  disabled={isTransmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{isTransmitting ? 'Sending Ping...' : 'Transmit Live GPS'}</span>
                </button>

                <a
                  href={`tel:${activeDelivery.buyer?.phone || '9876543210'}`}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact</span>
                </a>
              </div>

              <span className="text-xs font-bold text-emerald-700">
                Earnings: ₹{Math.round(activeDelivery.totalAmount * 0.1 || 150)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Available Delivery Orders List (Matching Screenshot 1 & 4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Available Delivery Orders</h2>
            <p className="text-xs text-slate-500">Choose an order that fits your route.</p>
          </div>
        </div>

        {availableOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No delivery orders currently waiting in your route radius.
          </div>
        ) : (
          availableOrders.map((o) => (
            <div
              key={o._id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-xs transition"
            >
              {/* Order Info */}
              <div className="w-full md:w-1/4">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Order</span>
                <p className="text-xs font-mono font-bold text-slate-900">
                  #KM{o._id.slice(-12).toUpperCase()}
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Delivery Available
                </span>
              </div>

              {/* Pickup Point */}
              <div className="w-full md:w-1/4 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" /> PICKUP
                </span>
                <p className="text-xs font-bold text-slate-800">{o.farmer?.name}</p>
                <p className="text-[11px] text-slate-500">{o.farmer?.address?.city || 'Sawantwadi, Sindhudurg'}</p>
              </div>

              {/* Drop-off Point */}
              <div className="w-full md:w-1/4 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-600" /> DROP-OFF
                </span>
                <p className="text-xs font-bold text-slate-800">{o.buyer?.name || 'Shopkeeper'}</p>
                <p className="text-[11px] text-slate-500">{o.buyer?.address?.city || 'Kudal, Sindhudurg'}</p>
              </div>

              {/* Earnings & Accept Button */}
              <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-2">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block">Delivery Earnings</span>
                  <span className="text-sm font-black text-slate-900">
                    ₹{Math.round(o.totalAmount * 0.1 || 150)}
                  </span>
                </div>

                <button
                  onClick={() => handleAcceptOrder(o._id)}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Accept Delivery</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}