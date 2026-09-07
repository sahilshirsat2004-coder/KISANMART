import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  IndianRupee, 
  Package, 
  CheckCircle2,
  Clock,
  Truck,
  Store,
  Sprout,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOverview = async () => {
    try {
      const res = await api.get('/orders/admin/overview');
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const { stats, roleCounts, users, orders } = data || {};

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_TRANSIT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'READY_FOR_PICKUP':
      case 'DRIVER_ASSIGNED':
      case 'PICKED_UP':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8 font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-3xl shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-700 block">
              Governance & Oversight
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Platform Administration
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl font-medium pt-1">
          Monitor real-time network liquidity, transaction fees, user verification, and global produce dispatch ledgers.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Gross Merchandise Value */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:border-emerald-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Gross Volume (GMV)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Direct mandi settlement</span>
          </div>
        </div>

        {/* Platform Fee */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:border-purple-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Platform Cut (5%)
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-purple-700 tracking-tight">
            ₹{(stats?.platformCommission || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Automated escrow fee
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:border-blue-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Total Shipments
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {stats?.totalOrders || 0}
          </div>
          <div className="text-[11px] font-semibold text-blue-600">
            Across 9 transit states
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:border-amber-200 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Registered Users
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {users?.length || 0}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Verified network participants
          </div>
        </div>

      </div>

      {/* Role Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sprout className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Farmers</span>
            <span className="text-sm font-black text-slate-900">{roleCounts?.FARMER || 0} Listed</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Shopkeepers</span>
            <span className="text-sm font-black text-slate-900">{roleCounts?.SHOPKEEPER || 0} Active</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Drivers</span>
            <span className="text-sm font-black text-slate-900">{roleCounts?.DRIVER || 0} Vehicles</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Admins</span>
            <span className="text-sm font-black text-slate-900">{roleCounts?.ADMIN || 0} Superusers</span>
          </div>
        </div>
      </div>

      {/* Global Order Audit Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm space-y-0">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Global Transaction Ledger</h3>
            <p className="text-xs text-slate-400 font-medium">End-to-end supply chain trace log for audits.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            {orders?.length || 0} Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Order ID</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Produce</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Shop Buyer</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Farmer Origin</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Gross (₹)</th>
                <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400 text-xs">
                    No transactions recorded in the network yet.
                  </td>
                </tr>
              ) : (
                orders?.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/60 transition">
                    <td className="p-4 font-mono font-bold text-slate-500">
                      #KM{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                      {o.product?.name || 'Produce'} <span className="text-slate-400 font-normal">({o.quantity} kg)</span>
                    </td>
                    <td className="p-4 text-slate-700">
                      {o.buyer?.name || 'Retail Store'}
                    </td>
                    <td className="p-4 text-slate-700">
                      {o.farmer?.name || 'Local Farm'}
                    </td>
                    <td className="p-4 font-black text-slate-900 text-sm">
                      ₹{o.totalAmount}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}