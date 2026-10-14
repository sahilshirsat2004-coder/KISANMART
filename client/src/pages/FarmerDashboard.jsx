import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  LayoutDashboard, 
  Sprout, 
  PackagePlus, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  ArrowLeft,
  Sparkles,
  Clock,
  IndianRupee,
  ChevronRight,
  LogOut,
  Calendar
} from 'lucide-react';

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'my-produce' | 'add' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    availableQuantity: '',
    unit: 'kg',
    pricePerUnit: '',
    farmingType: 'Conventional',
    expectedHarvestDate: '',
    availableFrom: '',
    location: 'Sawantwadi, Sindhudurg',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [prodRes, ordRes] = await Promise.all([
        api.get('/products/farmer/my-products'),
        api.get('/orders/my-orders')
      ]);
      setProducts(prodRes.data.products || []);
      setOrders(ordRes.data.orders || []);
    } catch (err) {
      console.error('Failed to load farmer workspace:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduce = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/products', {
        name: formData.name,
        category: formData.category,
        pricePerUnit: Number(formData.pricePerUnit),
        unit: formData.unit,
        availableQuantity: Number(formData.availableQuantity),
        type: formData.expectedHarvestDate ? 'FUTURE' : 'SPOT',
        expectedHarvestDate: formData.expectedHarvestDate || null
      });

      setNotification(`Produce "${formData.name}" listed successfully!`);
      setActiveTab('dashboard');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to list produce');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'READY_FOR_PICKUP' });
      setNotification('Order updated to READY_FOR_PICKUP for drivers!');
      fetchData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const totalEarnings = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status !== 'DELIVERED');
  const futureProduce = products.filter(p => p.type === 'FUTURE');

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 md:pb-6 font-sans">
      {/* Top Application Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-extrabold text-base shadow-sm shadow-emerald-600/30">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-lg tracking-tight">Kisan</span>
              <span className="font-black text-emerald-600 text-lg tracking-tight">Mart</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase ml-1">
                Farmer
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Sindhudurg Agro-Direct Logistics Hub</p>
          </div>
        </div>

        {/* Desktop Header Links */}
        <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <a href="/shop" className="hover:text-emerald-700 transition">Marketplace</a>
          <a href="/#how-it-works" className="hover:text-emerald-700 transition">Logistics</a>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-bold ml-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Logout Button */}
        <button 
          onClick={handleLogout} 
          className="md:hidden p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col md:flex-row gap-6">
        
        {/* Left Sidebar (Desktop Only) */}
        <aside className="w-60 bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2 hidden md:block shrink-0 shadow-sm self-start">
          <div className="px-3 py-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Workspace
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('my-produce')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'my-produce' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sprout className="w-4 h-4" />
              <span>My Produce</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'my-produce' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'add' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PackagePlus className="w-4 h-4" />
            <span>Add Produce</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {orders.length}
            </span>
          </button>
        </aside>

        {/* Dynamic Content Workspace */}
        <main className="flex-1 min-w-0 space-y-6">
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

          {/* ============================================================== */}
          {/* VIEW 1: DASHBOARD OVERVIEW */}
          {/* ============================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* High-Contrast Clear Welcome Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-emerald-950/10">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30">
                      Live Farm Operations
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                      Welcome back, Farmer 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-lg">
                      Here is what is happening across your crop reservations, active market orders, and logistics dispatch status.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('add')}
                    className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-950/20 transition self-start sm:self-auto cursor-pointer"
                  >
                    <PackagePlus className="w-4 h-4" />
                    <span>+ Add Produce</span>
                  </button>
                </div>
                <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-600/30 rounded-full blur-2xl pointer-events-none" />
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{orders.length}</div>
                  <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">↑ +12% this month</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Active Produce</span>
                    <Sprout className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{products.length}</div>
                  <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">↑ +8% this month</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{pendingOrders.length}</div>
                  <span className="text-[10px] font-bold text-amber-600 mt-1 inline-block">Requires dispatch</span>
                </div>

                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Earnings</span>
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">₹{totalEarnings.toLocaleString('en-IN')}</div>
                  <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">Settled revenue</span>
                </div>
              </div>

              {/* Recent Orders & Upcoming Harvest Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders Card */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">Recent Orders</h3>
                      <p className="text-xs text-slate-400">Latest produce purchases and pre-orders</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('orders')} 
                      className="text-xs text-emerald-700 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all ({orders.length})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-slate-400 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="pb-3 px-2">Order</th>
                          <th className="pb-3 px-2">Produce</th>
                          <th className="pb-3 px-2">Shop</th>
                          <th className="pb-3 px-2">Status</th>
                          <th className="pb-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-slate-400 font-medium">No recent orders found.</td>
                          </tr>
                        ) : (
                          orders.slice(0, 5).map((o) => (
                            <tr key={o._id} className="hover:bg-slate-50/80 transition">
                              <td className="py-3 px-2 font-mono font-bold text-slate-700">
                                #KM{o._id.slice(-6).toUpperCase()}
                              </td>
                              <td className="py-3 px-2">
                                <span className="font-bold text-slate-800">{o.product?.name || 'Produce'}</span>
                                <span className="text-slate-500 font-medium ml-1">({o.quantity} kg)</span>
                              </td>
                              <td className="py-3 px-2 text-slate-600 font-medium">{o.buyer?.name || 'Local Store'}</td>
                              <td className="py-3 px-2">
                                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                                  o.status === 'PREBOOKED' 
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                    : o.status === 'READY_FOR_PICKUP'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : o.status === 'DELIVERED'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {o.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                {o.status === 'PLACED' && (
                                  <button
                                    onClick={() => handleMarkReady(o._id)}
                                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                                  >
                                    Ready
                                  </button>
                                )}

                                {o.status === 'PREBOOKED' && (
                                  <button
                                    onClick={() => handleMarkReady(o._id)}
                                    title="Harvest is ready early? Dispatch immediately"
                                    className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-extrabold transition shadow-xs inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>Ready Now</span>
                                  </button>
                                )}

                                {o.status === 'READY_FOR_PICKUP' && (
                                  <span className="text-[11px] text-purple-600 font-bold">Waiting Driver</span>
                                )}

                                {o.status === 'DRIVER_ASSIGNED' && (
                                  <span className="text-[11px] text-blue-600 font-bold">Assigned</span>
                                )}

                                {o.status === 'IN_TRANSIT' && (
                                  <span className="text-[11px] text-cyan-600 font-bold">In Transit</span>
                                )}

                                {o.status === 'DELIVERED' && (
                                  <span className="text-[11px] text-emerald-600 font-bold">Completed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Responsive Cards */}
                  <div className="sm:hidden space-y-3">
                    {orders.slice(0, 5).map((o) => (
                      <div key={o._id} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-black text-slate-700">#KM{o._id.slice(-6).toUpperCase()}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            o.status === 'PREBOOKED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-900">{o.product?.name} ({o.quantity} kg)</span>
                          <span className="text-slate-500 font-medium">{o.buyer?.name || 'Local Store'}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-700">₹{o.totalAmount}</span>
                          <div>
                            {o.status === 'PLACED' && (
                              <button
                                onClick={() => handleMarkReady(o._id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                              >
                                Ready
                              </button>
                            )}
                            {o.status === 'PREBOOKED' && (
                              <button
                                onClick={() => handleMarkReady(o._id)}
                                className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" /> Ready Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Produce Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Upcoming Produce</h3>
                    <p className="text-xs text-slate-400">Future harvest available for booking</p>
                  </div>

                  <div className="space-y-3">
                    {futureProduce.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs italic bg-slate-50 rounded-2xl">
                        No future crops registered.
                      </div>
                    ) : (
                      futureProduce.slice(0, 4).map((fp) => (
                        <div key={fp._id} className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 transition rounded-2xl border border-slate-100 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-xs">{fp.name}</p>
                            <p className="text-[11px] text-slate-500 font-medium">{fp.availableQuantity} {fp.unit}</p>
                          </div>
                          <span className="text-[10px] font-black text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full border border-blue-200/60">
                            Pre-booking Open
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: ALL ORDERS VIEW (VIEW ALL) */}
          {/* ============================================================== */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">All Farm Orders</h2>
                  <p className="text-xs text-slate-400">Manage dispatch readiness for spot and pre-booked crops.</p>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer self-start"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </button>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider pb-2 font-bold">
                    <tr>
                      <th className="pb-3 px-3">ORDER ID</th>
                      <th className="pb-3 px-3">PRODUCE</th>
                      <th className="pb-3 px-3">SHOPKEEPER</th>
                      <th className="pb-3 px-3">TOTAL AMOUNT</th>
                      <th className="pb-3 px-3">STATUS</th>
                      <th className="pb-3 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-slate-400">No orders found.</td>
                      </tr>
                    ) : (
                      orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                            #KM{o._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-slate-800">{o.product?.name || 'Produce'}</span>
                            <span className="text-slate-500 font-medium ml-1">({o.quantity} kg)</span>
                          </td>
                          <td className="py-3.5 px-3 text-slate-600 font-medium">{o.buyer?.name || 'Local Store'}</td>
                          <td className="py-3.5 px-3 font-black text-emerald-800">
                            ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-3">
                            <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                              o.status === 'PREBOOKED' 
                                ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                                : o.status === 'READY_FOR_PICKUP'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : o.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            {o.status === 'PLACED' && (
                              <button
                                onClick={() => handleMarkReady(o._id)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer transition shadow-xs"
                              >
                                Ready for Pickup
                              </button>
                            )}

                            {o.status === 'PREBOOKED' && (
                              <button
                                onClick={() => handleMarkReady(o._id)}
                                title="Crop ready early? Dispatch ahead of schedule"
                                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-extrabold cursor-pointer transition shadow-xs inline-flex items-center gap-1.5"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Ready Early</span>
                              </button>
                            )}

                            {o.status === 'READY_FOR_PICKUP' && (
                              <span className="text-[11px] text-purple-600 font-bold">Waiting Driver</span>
                            )}

                            {o.status === 'DRIVER_ASSIGNED' && (
                              <span className="text-[11px] text-blue-600 font-bold">Driver Assigned</span>
                            )}

                            {o.status === 'IN_TRANSIT' && (
                              <span className="text-[11px] text-cyan-600 font-bold">In Transit</span>
                            )}

                            {o.status === 'DELIVERED' && (
                              <span className="text-[11px] text-emerald-600 font-bold inline-flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View for Orders Tab */}
              <div className="sm:hidden space-y-3">
                {orders.map((o) => (
                  <div key={o._id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-slate-800">#KM{o._id.slice(-6).toUpperCase()}</span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        o.status === 'PREBOOKED' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {o.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-900">{o.product?.name} ({o.quantity} kg)</p>
                      <p className="text-slate-500">Shopkeeper: {o.buyer?.name || 'Local Store'}</p>
                      <p className="font-extrabold text-emerald-700">Amount: ₹{o.totalAmount?.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-end">
                      {o.status === 'PLACED' && (
                        <button
                          onClick={() => handleMarkReady(o._id)}
                          className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                        >
                          Mark Ready for Pickup
                        </button>
                      )}
                      {o.status === 'PREBOOKED' && (
                        <button
                          onClick={() => handleMarkReady(o._id)}
                          className="w-full py-2 bg-amber-500 text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Ready Early (Dispatch Now)
                        </button>
                      )}
                      {o.status === 'READY_FOR_PICKUP' && (
                        <span className="text-xs text-purple-600 font-bold">Waiting for Driver Pickup</span>
                      )}
                      {o.status === 'DELIVERED' && (
                        <span className="text-xs text-emerald-600 font-bold">Completed & Settled</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 3: ADD PRODUCE FORM */}
          {/* ============================================================== */}
          {activeTab === 'add' && (
            <div className="max-w-2xl bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs mx-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
              </button>

              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Produce Information</h2>
                <p className="text-xs text-slate-400 mt-0.5">Enter the basic details of your produce.</p>
              </div>

              <form onSubmit={handleAddProduce} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Fresh Tomatoes"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="Vegetables">Vegetables</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Grains">Grains</option>
                      <option value="Pulses">Pulses</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Available Quantity *</label>
                    <input
                      type="number"
                      name="availableQuantity"
                      value={formData.availableQuantity}
                      onChange={handleInputChange}
                      placeholder="500"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    >
                      <option value="kg">kg</option>
                      <option value="crate">crate</option>
                      <option value="quintal">quintal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Price per unit (₹) *</label>
                    <input
                      type="number"
                      name="pricePerUnit"
                      value={formData.pricePerUnit}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Availability & Harvest Date */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Availability</span>
                  <p className="text-[11px] text-slate-400 -mt-1">Tell buyers when the produce will be ready.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Harvest Date</label>
                      <input
                        type="date"
                        name="expectedHarvestDate"
                        value={formData.expectedHarvestDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Farming Type</label>
                      <select
                        name="farmingType"
                        value={formData.farmingType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-emerald-500"
                      >
                        <option value="Conventional">Conventional</option>
                        <option value="Organic">Organic Certified</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Farm Location */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">Farm Location</span>
                  <p className="text-[11px] text-slate-400 -mt-1">This helps us match your produce with nearby buyers.</p>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Village, Taluka, District (e.g. Sawantwadi, Sindhudurg)"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {loading ? 'Listing...' : 'Publish Produce'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 4: MY LISTED PRODUCE */}
          {/* ============================================================== */}
          {activeTab === 'my-produce' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">My Active Produce</h2>
                  <p className="text-xs text-slate-400">Live inventory available for order on the KisanMart marketplace</p>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-extrabold rounded-xl hover:bg-emerald-700 transition"
                >
                  + Add New
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p._id} className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-3 shadow-xs hover:border-emerald-500/50 transition">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        p.type === 'FUTURE' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.type}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">{p.category}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{p.name}</h4>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Available Stock</span>
                        <span className="text-xs font-bold text-slate-700">{p.availableQuantity} {p.unit}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block">Rate</span>
                        <span className="text-sm font-black text-emerald-700">₹{p.pricePerUnit} / {p.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ============================================================== */}
      {/* MOBILE BOTTOM NAVIGATION BAR (Thumb-friendly on Phones) */}
      {/* ============================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2.5 flex items-center justify-around z-50 shadow-lg">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('my-produce')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'my-produce' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <Sprout className="w-5 h-5" />
          <span className="text-[10px]">Produce</span>
        </button>

        <button
          onClick={() => setActiveTab('add')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'add' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <PackagePlus className="w-5 h-5" />
          <span className="text-[10px]">Add</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex flex-col items-center gap-1 ${
            activeTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px]">Orders ({orders.length})</span>
        </button>
      </div>
    </div>
  );
}