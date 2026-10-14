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
  IndianRupee,
  Layers,
  LogOut,
  ChevronRight
} from 'lucide-react';

let socket;

// Safely formats string or object address: { city, state, pincode }
const formatAddress = (addr, fallback = 'Sindhudurg') => {
  if (!addr) return fallback;
  if (typeof addr === 'string') return addr;
  const parts = [addr.street, addr.city, addr.state, addr.pincode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : fallback;
};

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'active' | 'history'
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
      setActiveTab('active');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim delivery');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setNotification(`Status updated to ${newStatus.replace('_', ' ')}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Status transition failed');
    }
  };

  const handleTransmitGPS = (orderId) => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
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
        setNotification(`GPS broadcasted: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setIsTransmitting(false);
      },
      () => {
        const lat = 15.9042 + (Math.random() - 0.5) * 0.02;
        const lng = 73.8180 + (Math.random() - 0.5) * 0.02;
        socket.emit('send_location_update', { orderId, lat, lng });
        setNotification(`Simulated telemetry GPS ping emitted!`);
        setIsTransmitting(false);
      }
    );
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const completed = myOrders.filter((o) => o.status === 'DELIVERED');
  const todayEarnings = completed.reduce((sum, o) => sum + (o.totalAmount * 0.1 || 150), 0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 md:pb-8 font-sans">
      {/* Top Application Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm shadow-blue-600/30">
            🚚
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-lg tracking-tight">Kisan</span>
              <span className="font-black text-emerald-600 text-lg tracking-tight">Mart</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase ml-1">
                Driver
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Sindhudurg Transit Freight Partner</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Duty:</span>
            <select
              value={vehicleStatus}
              onChange={(e) => setVehicleStatus(e.target.value)}
              className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="Available">Available (Online)</option>
              <option value="Busy">In Transit (Busy)</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <button 
            onClick={handleLogout} 
            className="hidden sm:flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold text-xs p-2 rounded-xl hover:bg-rose-50 transition cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-slate-950/20">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-950/70 px-3 py-1 rounded-full border border-blue-500/30 inline-flex items-center gap-1.5">
                <Navigation className="w-3 h-3 text-blue-400" /> Rural Transport Logistics
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-2.5 tracking-tight text-white">
                Delivery Route Dashboard 🚚
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                Pick up fresh produce from local farms and deliver directly to retail shops.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-300 block font-medium uppercase">Active Cargo</span>
                <span className="text-xs font-bold text-white">
                  {activeDelivery ? `#KM${activeDelivery._id.slice(-6).toUpperCase()}` : 'None Assigned'}
                </span>
              </div>
              <div className={`w-3 h-3 rounded-full ${activeDelivery ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            </div>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 text-emerald-900 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')} className="p-1 hover:bg-emerald-100 rounded-lg transition cursor-pointer">✕</button>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Available Jobs</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{availableOrders.length}</div>
            <span className="text-[10px] font-bold text-blue-600 mt-1 inline-block">Waiting in area</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Active Run</span>
              <Truck className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{activeDelivery ? 1 : 0}</div>
            <span className="text-[10px] font-bold text-amber-600 mt-1 inline-block">
              {activeDelivery ? activeDelivery.status : 'Idle / Free'}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{completed.length}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">Settled shipments</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Pay</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">₹{todayEarnings}</div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">10% freight fee</span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-fit">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'available' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Available Jobs ({availableOrders.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'active' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Active Cargo</span>
            {activeDelivery && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
              activeTab === 'history' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            History ({completed.length})
          </button>
        </div>

        {/* ACTIVE DELIVERY CONSOLE */}
        {activeDelivery && (activeTab === 'active' || activeTab === 'available') && (
          <div className="rounded-3xl border-2 border-blue-500/80 overflow-hidden shadow-md bg-white">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-5 sm:px-6 py-4 text-white flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-black tracking-wider text-blue-200 block">
                  ONGOING DISPATCH CONSOLE
                </span>
                <span className="text-sm font-mono font-bold">
                  Order #KM{activeDelivery._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/20 font-bold px-3 py-1 rounded-full uppercase">
                  {activeDelivery.status}
                </span>
                <Truck className="w-5 h-5 text-white/90" />
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">STOP 1 • PICKUP</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{activeDelivery.farmer?.name || 'Local Farm'}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium pl-5.5">
                    {formatAddress(activeDelivery.farmer?.address, 'Sawantwadi, Sindhudurg')}
                  </p>
                  <p className="text-[11px] text-slate-400 pl-5.5">
                    Cargo: {activeDelivery.product?.name || 'Produce'} ({activeDelivery.quantity} kg)
                  </p>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center text-blue-600">
                  <Navigation className="w-5 h-5 rotate-90 text-blue-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 mt-1">Direct Transit</span>
                </div>

                <div className="space-y-1 md:text-right">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">STOP 2 • DROP-OFF</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-blue-800 md:justify-end">
                    <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{activeDelivery.buyer?.name || 'Shopkeeper'}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {formatAddress(activeDelivery.buyer?.address || activeDelivery.buyer?.deliveryAddress, 'Kudal, Sindhudurg')}
                  </p>
                </div>
              </div>

              {/* Status Stepper */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2.5">
                  Update Delivery Progress:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(activeDelivery._id, 'DRIVER_ASSIGNED')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      activeDelivery.status === 'DRIVER_ASSIGNED'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    1. Assigned
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeDelivery._id, 'PICKED_UP')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      activeDelivery.status === 'PICKED_UP'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    2. Cargo Picked Up
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeDelivery._id, 'IN_TRANSIT')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      activeDelivery.status === 'IN_TRANSIT'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    3. In Transit
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(activeDelivery._id, 'DELIVERED')}
                    className="py-2.5 px-3 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 shadow-sm transition cursor-pointer"
                  >
                    4. Mark Delivered ✓
                  </button>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTransmitGPS(activeDelivery._id)}
                    disabled={isTransmitting}
                    className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse text-amber-300" />
                    <span>{isTransmitting ? 'Transmitting...' : 'Transmit Live GPS'}</span>
                  </button>

                  <a
                    href={`tel:${activeDelivery.buyer?.phone || '9876543210'}`}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Call Shop</span>
                  </a>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 text-right">
                  <span className="text-xs text-slate-400 font-medium">Route Payout:</span>
                  <span className="text-base font-black text-emerald-700">
                    ₹{Math.round(activeDelivery.totalAmount * 0.1 || 150)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AVAILABLE JOBS POOL */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Available Delivery Orders</h2>
              <p className="text-xs text-slate-400">Claim farm orders that are packed and ready for immediate transit.</p>
            </div>

            {availableOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-8 space-y-2">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">No Orders Waiting</h3>
                <p className="text-slate-400 text-xs max-w-sm mx-auto">
                  There are currently no orders flagged as 'Ready for Pickup' in your radius.
                </p>
              </div>
            ) : (
              availableOrders.map((o) => (
                <div
                  key={o._id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-blue-400 transition shadow-xs"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ORDER</span>
                    <p className="text-xs font-mono font-black text-slate-900">
                      #KM{o._id.slice(-8).toUpperCase()}
                    </p>
                    <span className="text-[10px] text-emerald-800 font-black bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-block">
                      Ready for Pickup
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-1">
                      {o.product?.name} ({o.quantity} kg)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> PICKUP LOCATION
                    </span>
                    <p className="text-xs font-bold text-slate-800">{o.farmer?.name || 'Local Farm'}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {formatAddress(o.farmer?.address, 'Sawantwadi, Sindhudurg')}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> DROP-OFF LOCATION
                    </span>
                    <p className="text-xs font-bold text-slate-800">{o.buyer?.name || 'Retail Shop'}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {formatAddress(o.buyer?.address || o.buyer?.deliveryAddress, 'Kudal, Sindhudurg')}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 font-bold block">Delivery Pay</span>
                      <span className="text-base font-black text-slate-900">
                        ₹{Math.round(o.totalAmount * 0.1 || 150)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAcceptOrder(o._id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <span>Accept Delivery</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 space-y-5 shadow-xs">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Completed Deliveries</h2>
              <p className="text-xs text-slate-400">All past shipments delivered safely by your vehicle.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider pb-2 font-bold">
                  <tr>
                    <th className="pb-3 px-3">ORDER</th>
                    <th className="pb-3 px-3">PRODUCE</th>
                    <th className="pb-3 px-3">DESTINATION</th>
                    <th className="pb-3 px-3">EARNINGS</th>
                    <th className="pb-3 px-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completed.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">No completed deliveries yet.</td>
                    </tr>
                  ) : (
                    completed.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50">
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          #KM{o._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {o.product?.name || 'Produce'} ({o.quantity} kg)
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {o.buyer?.name || 'Store'} • {formatAddress(o.buyer?.address || o.buyer?.deliveryAddress, 'Sindhudurg')}
                        </td>
                        <td className="py-3 px-3 font-black text-emerald-700">
                          ₹{Math.round(o.totalAmount * 0.1 || 150)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Delivered
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex items-center justify-around z-50 shadow-lg">
        <button
          onClick={() => setActiveTab('available')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'available' ? 'text-blue-700 font-bold' : 'text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px]">Available ({availableOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'active' ? 'text-blue-700 font-bold' : 'text-slate-400'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span className="text-[10px]">Active Run</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 cursor-pointer ${
            activeTab === 'history' ? 'text-blue-700 font-bold' : 'text-slate-400'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>
      </div>
    </div>
  );
}