import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  LayoutDashboard, 
  Sprout, 
  PackagePlus, 
  Calendar, 
  ShoppingCart, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  ArrowLeft 
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

  const totalEarnings = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingOrders = orders.filter((o) => o.status !== 'DELIVERED');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Sidebar Navigation (Matching Screenshot 7) */}
      <aside className="w-56 bg-white border-r border-slate-200 p-4 space-y-6 hidden md:block shrink-0">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-sm">
            K
          </div>
          <span className="font-bold text-slate-800 text-sm">KisanMart</span>
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-700" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('my-produce')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'my-produce' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>My Produce</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'add' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <PackagePlus className="w-4 h-4 text-emerald-700" />
            <span>Add Produce</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShoppingCart className="w-4 h-4 text-emerald-700" />
            <span>Orders ({orders.length})</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto">
        {notification && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification('')}>✕</button>
          </div>
        )}

        {/* VIEW 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-medium">Farmer Dashboard</span>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Welcome back, Farmer 👋</h1>
                <p className="text-xs text-slate-500">Here's what's happening with your farm today.</p>
              </div>

              <button
                onClick={() => setActiveTab('add')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
              >
                <span>+ Add Produce</span>
              </button>
            </div>

            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 font-medium">Total Orders</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{orders.length}</div>
                <span className="text-[10px] text-emerald-600 font-medium">↑ +12% this month</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 font-medium">Active Produce</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{products.length}</div>
                <span className="text-[10px] text-emerald-600 font-medium">↑ +8% this month</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 font-medium">Pending Orders</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{pendingOrders.length}</div>
                <span className="text-[10px] text-amber-600 font-medium">Requires dispatch</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] text-slate-400 font-medium">Total Earnings</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">₹{totalEarnings.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-emerald-600 font-medium">↑ Settled revenue</span>
              </div>
            </div>

            {/* Recent Orders & Upcoming Produce Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Table */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-emerald-700 font-bold hover:underline">
                    View all
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 border-b border-slate-100 pb-2">
                      <tr>
                        <th className="pb-2 font-semibold">ORDER</th>
                        <th className="pb-2 font-semibold">PRODUCE</th>
                        <th className="pb-2 font-semibold">SHOP</th>
                        <th className="pb-2 font-semibold">STATUS</th>
                        <th className="pb-2 font-semibold">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400">No recent orders.</td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((o) => (
                          <tr key={o._id} className="hover:bg-slate-50">
                            <td className="py-3 font-mono font-bold text-slate-600">#KM{o._id.slice(-6).toUpperCase()}</td>
                            <td className="py-3 font-medium">{o.product?.name} ({o.quantity} kg)</td>
                            <td className="py-3 text-slate-500">{o.buyer?.name || 'Local Store'}</td>
                            <td className="py-3">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3">
                              {o.status === 'PLACED' && (
                                <button
                                  onClick={() => handleMarkReady(o._id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
                                >
                                  Ready
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Produce Column */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
                <h3 className="font-bold text-slate-900 text-sm">Upcoming Produce</h3>
                <p className="text-[11px] text-slate-400 -mt-2">Future harvest available for booking</p>

                <div className="space-y-3">
                  {products.filter(p => p.type === 'FUTURE').slice(0, 3).map((fp) => (
                    <div key={fp._id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{fp.name}</p>
                        <p className="text-[11px] text-slate-400">{fp.availableQuantity} {fp.unit}</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Pre-booking Open
                      </span>
                    </div>
                  ))}
                  {products.filter(p => p.type === 'FUTURE').length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No future crops registered.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ADD PRODUCE FORM (Matching Screenshot 8 & 9) */}
        {activeTab === 'add' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div>
              <h2 className="text-lg font-bold text-slate-900">Produce Information</h2>
              <p className="text-xs text-slate-400 mt-0.5">Enter the basic details of your produce.</p>
            </div>

            <form onSubmit={handleAddProduce} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Fresh Tomatoes"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500 bg-white"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={formData.availableQuantity}
                    onChange={handleInputChange}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="kg">kg</option>
                    <option value="crate">crate</option>
                    <option value="quintal">quintal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Price per unit (₹) *</label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleInputChange}
                    placeholder="30"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Farming Type</label>
                    <select
                      name="farmingType"
                      value={formData.farmingType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shadow-sm"
                >
                  {loading ? 'Listing...' : 'Publish Produce'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: MY LISTED PRODUCE */}
        {activeTab === 'my-produce' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-xs">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {p.type}
                </span>
                <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                <p className="text-xs text-slate-500">Stock: {p.availableQuantity} {p.unit}</p>
                <p className="text-xs font-bold text-emerald-700">Rate: ₹{p.pricePerUnit} / {p.unit}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}