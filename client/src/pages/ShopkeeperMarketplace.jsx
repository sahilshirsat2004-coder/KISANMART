import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Search, 
  Sprout, 
  MapPin, 
  Calendar, 
  Star, 
  Check, 
  FileText, 
  Truck, 
  AlertCircle,
  X 
} from 'lucide-react';

export default function ShopkeeperMarketplace() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authPrompt, setAuthPrompt] = useState('');

  const fetchProduce = async () => {
    try {
      let query = [];
      if (category !== 'All') query.push(`category=${category}`);
      const qs = query.length > 0 ? `?${query.join('&')}` : '';
      const res = await api.get(`/products${qs}`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await api.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  useEffect(() => {
    fetchProduce();
  }, [category]);

  useEffect(() => {
    if (activeTab === 'orders') {
      if (!user) {
        setAuthPrompt('Please sign in first to view your active orders.');
        setTimeout(() => navigate('/login'), 1800);
      } else {
        fetchOrders();
      }
    }
  }, [activeTab, user]);

  // Intercept action for unauthenticated users
  const handleInitiateOrder = (product) => {
    if (!user) {
      setAuthPrompt('Please sign in first to place or pre-book orders on KisanMart.');
      setTimeout(() => {
        navigate('/login');
      }, 1800);
      return;
    }

    if (user.role !== 'SHOPKEEPER' && user.role !== 'ADMIN') {
      alert(`Your active role is "${user.role}". Only Shopkeeper accounts can place purchase orders.`);
      return;
    }

    setSelectedProduct(product);
    setOrderQuantity(Math.min(10, product.availableQuantity));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsSubmitting(true);

    try {
      await api.post('/orders', {
        productId: selectedProduct._id,
        quantity: Number(orderQuantity),
        deliveryAddress: {
          city: user?.address?.city || 'Kudal, Sindhudurg',
          state: user?.address?.state || 'Maharashtra'
        }
      });
      setSelectedProduct(null);
      fetchProduce();
      setActiveTab('orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice_${orderId.slice(-6).toUpperCase()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to download invoice');
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans">
      
      {/* Authentication Prompt Banner */}
      {authPrompt && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce">
          <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold leading-tight">Authentication Required</p>
              <p className="text-[11px] text-amber-100 mt-0.5">{authPrompt}</p>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold">Redirecting...</span>
          </div>
        </div>
      )}

      {/* Dark Forest Green Hero Section */}
      <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-900 text-white pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">KisanMart Marketplace</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 flex items-center gap-2">
                Fresh produce, directly from farmers 🌱
              </h1>
              <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-xl">
                Discover fresh vegetables and fruits from local farmers. Buy directly, reduce middlemen, and get better prices for your shop.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'browse' ? 'bg-amber-600 text-white' : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                Browse Produce
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'orders' ? 'bg-amber-600 text-white' : 'bg-emerald-800/60 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                My Orders ({user ? orders.length : 0})
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tomatoes, potatoes, mangoes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 text-xs sm:text-sm rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-400 placeholder:text-slate-400 font-medium"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                  category === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-800/50 text-emerald-200 hover:bg-emerald-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Value Prop Info Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-center gap-3">
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold">🌱</span>
            <div>
              <p className="font-bold text-slate-800">Direct From Farmers</p>
              <p className="text-[11px] text-slate-500">Buy directly and reduce middlemen.</p>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600 font-bold">🚚</span>
            <div>
              <p className="font-bold text-slate-800">Flexible Delivery</p>
              <p className="text-[11px] text-slate-500">Travelling vehicles can deliver orders.</p>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-center gap-3">
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600 font-bold">🛡</span>
            <div>
              <p className="font-bold text-slate-800">Fresh & Traceable</p>
              <p className="text-[11px] text-slate-500">Know the farmer and produce source.</p>
            </div>
          </div>
        </div>

        {/* TAB 1: BROWSE PRODUCE */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold text-slate-800 text-sm">
                Fresh Produce <span className="font-normal text-xs text-slate-500">({filteredProducts.length} available)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredProducts.map((p) => {
                const isFuture = p.type === 'FUTURE';
                return (
                  <div
                    key={p._id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition flex flex-col justify-between"
                  >
                    {/* Mint Top Illustration */}
                    <div className="bg-gradient-to-b from-teal-50 to-emerald-100/60 p-5 relative flex flex-col items-center justify-center min-h-[140px]">
                      <span
                        className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isFuture ? 'bg-blue-600 text-white' : 'bg-emerald-700 text-white'
                        }`}
                      >
                        {isFuture ? 'Future Harvest' : 'Available Now'}
                      </span>

                      <div className="w-14 h-14 rounded-full bg-emerald-200/50 flex items-center justify-center text-emerald-800">
                        <Sprout className="w-8 h-8" />
                      </div>
                      <span className="text-[11px] font-medium text-emerald-800 mt-2">Fresh Farm Produce</span>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-700 tracking-wider uppercase">
                          {p.category || 'VEGETABLES'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                        <p className="text-xs text-slate-500">By {p.farmer?.name || 'Local Producer'}</p>

                        <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold pt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>4.8 (24)</span>
                        </div>

                        <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{p.farmer?.address?.city || 'Sawantwadi, Sindhudurg'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>
                              {isFuture && p.expectedHarvestDate
                                ? `Harvest: ${new Date(p.expectedHarvestDate).toLocaleDateString()}`
                                : 'Harvested: Ready for dispatch'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Available Stock</span>
                            <span className="text-xs font-bold text-slate-700">{p.availableQuantity} {p.unit}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Price</span>
                            <span className="text-sm font-black text-emerald-700">₹{p.pricePerUnit} <span className="text-[11px] font-normal text-slate-500">/{p.unit}</span></span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleInitiateOrder(p)}
                          className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>{isFuture ? 'Pre-Book Harvest Yield' : 'Add to Order'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && user && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
                No orders placed yet.
              </div>
            ) : (
              orders.map((o) => (
                <div key={o._id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">
                          Order #KM{o._id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Placed: {new Date(o.createdAt || Date.now()).toLocaleString()}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Cost</span>
                      <span className="text-base font-extrabold text-slate-900">₹{o.totalAmount}</span>
                    </div>
                  </div>

                  {/* Line item details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold block text-[11px]">Order Items</span>
                      <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <Sprout className="w-4 h-4 text-emerald-600" />
                        <span>{o.product?.name} ({o.quantity} {o.product?.unit || 'kg'})</span>
                        <span className="text-slate-400 font-normal">— ₹{o.totalAmount}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-semibold block text-[11px]">Farmer</span>
                      <p className="font-bold text-slate-800">{o.farmer?.name}</p>
                      <p className="text-slate-500 text-[11px]">{o.farmer?.address?.city || 'Sawantwadi, Sindhudurg'}</p>
                    </div>
                  </div>

                  {/* Delivery Status Row */}
                  <div className="bg-slate-50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-slate-400 text-[11px] block font-medium">Delivery Status</span>
                      <p className="text-xs font-bold text-slate-800">
                        {o.driver ? `Assigned to ${o.driver.name} (${o.driver.phone})` : 'Searching for Vehicle'}
                      </p>
                      <p className="text-[11px] text-slate-500">Delivery to: {o.deliveryAddress?.city || 'Local Shop'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {o.status === 'DELIVERED' && (
                        <button
                          onClick={() => handleDownloadInvoice(o._id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Tax Invoice</span>
                        </button>
                      )}

                      {/* Navigates directly to dedicated /tracking/:orderId */}
                      <button
                        onClick={() => navigate(`/tracking/${o._id}`)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Order</span>
                      </button>
                    </div>
                  </div>

                  {/* Stepper Progress */}
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase block mb-3">Order Progress</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1">
                        <Check className="w-3 h-3" /> Order Placed
                      </div>
                      <div className={`p-2 rounded-lg flex items-center justify-center gap-1 ${
                        ['READY_FOR_PICKUP', 'DRIVER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(o.status)
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        Farmer Confirmed
                      </div>
                      <div className={`p-2 rounded-lg flex items-center justify-center gap-1 ${
                        ['DRIVER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'].includes(o.status)
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        Vehicle Assigned
                      </div>
                      <div className={`p-2 rounded-lg flex items-center justify-center gap-1 ${
                        o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                      }`}>
                        Delivered
                      </div>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {selectedProduct && user && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Confirm Produce Order</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Produce:</span>
                <span className="font-bold text-slate-900">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price:</span>
                <span className="font-bold text-emerald-700">₹{selectedProduct.pricePerUnit} / {selectedProduct.unit}</span>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Quantity ({selectedProduct.unit})
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct.availableQuantity}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl text-xs font-bold text-emerald-900">
                <span>Total Amount:</span>
                <span>₹{(orderQuantity * selectedProduct.pricePerUnit).toLocaleString('en-IN')}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Placing...' : 'Confirm Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}