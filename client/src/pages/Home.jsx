import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  Store, 
  Star, 
  MapPin, 
  BarChart3, 
  Radio 
} from 'lucide-react';

export default function Home() {
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-[#F7FCF8] text-slate-800 font-sans antialiased overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-emerald-100/60 via-emerald-50/20 to-transparent pointer-events-none -z-10 blur-3xl"></div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Pill Announcement */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#00C060] animate-ping"></span>
              <span>India's Smart Farm-to-Shop Marketplace</span>
            </div>

            {/* Title with Gradient Accent */}
            <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-black tracking-tight text-slate-900 leading-[1.12]">
              Fresh From <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#00C060]">
                Farmers to Shops.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed font-medium">
              KisanMart connects farmers directly with shopkeepers, making fresh
              produce trading simpler, faster and more transparent — with smart
              delivery and live tracking.
            </p>

            {/* Glowing Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md flex items-center bg-white border border-emerald-200/80 rounded-2xl p-2 shadow-lg shadow-emerald-900/5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition duration-200">
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-emerald-600" />
              </div>
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search vegetables, fruits..."
                className="w-full px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#00C060] hover:bg-[#00ab55] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Hero Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/shop"
                className="px-7 py-3.5 rounded-xl bg-[#00C060] hover:bg-[#00ab55] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 transition shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 hover:-translate-y-0.5 cursor-pointer duration-150"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-xs sm:text-sm font-extrabold transition cursor-pointer shadow-xs hover:border-slate-300"
              >
                Join as Farmer
              </Link>
            </div>

            {/* Verification Features */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                </div>
                <span>Verified users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Truck className="w-3 h-3 text-emerald-600" />
                </div>
                <span>Reliable delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Radio className="w-3 h-3 text-emerald-600" />
                </div>
                <span>Live tracking</span>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 rounded-3xl blur-2xl -z-10"></div>

            <div className="w-full max-w-md bg-gradient-to-b from-[#E7F8ED] to-[#DBF4E3] rounded-3xl p-8 border border-emerald-200/60 shadow-xl shadow-emerald-900/5 relative space-y-6">
              
              {/* Star Freshness Rating Badge */}
              <div className="absolute top-5 right-5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-100 shadow-md flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Freshness</span>
                <div className="flex items-center gap-1 text-xs font-black text-slate-800">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>4.9/5</span>
                </div>
              </div>

              {/* Central Logo Emblem */}
              <div className="pt-4 flex justify-center">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-lg shadow-emerald-900/10 border border-emerald-100 flex items-center justify-center transform hover:scale-105 transition duration-300">
                  <Sprout className="w-12 h-12 text-[#00C060]" />
                </div>
              </div>

              {/* 3D Produce Display Row */}
              <div className="bg-white/90 backdrop-blur-md py-3.5 px-6 rounded-2xl border border-emerald-100/90 shadow-md flex items-center justify-around text-3xl">
                <span className="hover:scale-125 transition duration-150">🍅</span>
                <span className="hover:scale-125 transition duration-150">🥕</span>
                <span className="hover:scale-125 transition duration-150">🥔</span>
                <span className="hover:scale-125 transition duration-150">🥬</span>
              </div>

              <p className="text-center text-xs font-bold text-emerald-800 tracking-wide">
                Fresh produce directly from local farms
              </p>

              {/* Live Transit Float Pill */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-lg shadow-emerald-950/5 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#00C060] shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Delivery status</span>
                  <span className="text-xs font-extrabold text-slate-900">Driver is on the way</span>
                </div>
              </div>

              {/* Local Hub Pill */}
              <div className="absolute -bottom-5 right-2 sm:-right-4 bg-white rounded-2xl px-4 py-2.5 border border-slate-100 shadow-xl flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Serving nearby</span>
                  <span className="text-xs font-extrabold text-slate-800">Local Farmers & Shops</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. HOW KISANMART WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col items-center space-y-16">
        
        <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-xs">
            <span>SIMPLE PROCESS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            How KisanMart Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto text-center leading-relaxed font-medium">
            A simple digital marketplace connecting farmers, shopkeepers and delivery partners.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center space-y-4 hover:border-emerald-200 hover:-translate-y-1 transition duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8EE] text-[#00C060] flex items-center justify-center shadow-inner">
              <Sprout className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
              STEP 01
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Farmers List Produce</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
              Farmers can upload their fresh produce, quantity, price and expected availability.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center space-y-4 hover:border-emerald-200 hover:-translate-y-1 transition duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8EE] text-[#00C060] flex items-center justify-center shadow-inner">
              <Store className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
              STEP 02
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Shops Place Orders</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
              Shopkeepers can browse the marketplace, compare produce and place orders directly.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center space-y-4 hover:border-emerald-200 hover:-translate-y-1 transition duration-200">
            <div className="w-16 h-16 rounded-2xl bg-[#E8F8EE] text-[#00C060] flex items-center justify-center shadow-inner">
              <Truck className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase block">
              STEP 03
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Delivery Made Easy</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs font-medium">
              Travelling vehicles can accept delivery jobs and deliver produce to shops with tracking.
            </p>
          </div>

        </div>
      </section>

      {/* 3. POWERFUL FEATURES SECTION */}
      <section id="features" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Feature highlights */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold shadow-xs">
                <span>POWERFUL FEATURES</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                Everything needed for a smarter <br />
                farm-to-shop supply chain.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                KisanMart brings farmers, shopkeepers and delivery partners together on one platform.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#00C060] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Direct Farmer-to-Shop Trading</h4>
                  <p className="text-sm text-slate-600 mt-0.5 font-medium leading-relaxed">
                    Reduce unnecessary middlemen and make produce trading more transparent.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#00C060] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Future Produce Planning</h4>
                  <p className="text-sm text-slate-600 mt-0.5 font-medium leading-relaxed">
                    Farmers can list expected produce in advance so shops can plan inventory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#00C060] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Smart Delivery Network</h4>
                  <p className="text-sm text-slate-600 mt-0.5 font-medium leading-relaxed">
                    Travelling vehicles can accept orders along their route and earn from deliveries.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 text-[#00C060] flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Live Order Tracking</h4>
                  <p className="text-sm text-slate-600 mt-0.5 font-medium leading-relaxed">
                    Track deliveries from pickup to shop using real-time location updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Vivid Green Hero Widget */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-br from-[#00C060] to-[#009b4d] text-white rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-600/30 space-y-7 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner">
                <Sprout className="w-7 h-7 text-white" />
              </div>

              <div className="space-y-2.5">
                <h3 className="text-2xl sm:text-4xl font-black leading-snug tracking-tight">
                  Built for India's agricultural ecosystem.
                </h3>
                <p className="text-sm text-emerald-50 leading-relaxed font-medium opacity-90">
                  From the farm gate to the neighbourhood shop, KisanMart helps make the entire journey simpler and more connected.
                </p>
              </div>

              {/* 4 Square Grid Tiles */}
              <div className="grid grid-cols-2 gap-3.5 pt-2">
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:bg-white/20 transition">
                  <div className="text-2xl font-black text-white">100%</div>
                  <div className="text-xs text-emerald-100 font-bold mt-1">Digital Marketplace</div>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:bg-white/20 transition">
                  <div className="text-2xl font-black text-white">24/7</div>
                  <div className="text-xs text-emerald-100 font-bold mt-1">Order Access</div>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:bg-white/20 transition">
                  <div className="text-2xl font-black text-white">Live</div>
                  <div className="text-xs text-emerald-100 font-bold mt-1">Tracking</div>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4.5 border border-white/10 hover:bg-white/20 transition">
                  <div className="text-2xl font-black text-white">Direct</div>
                  <div className="text-xs text-emerald-100 font-bold mt-1">Farm Trade</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. WHY KISANMART? SECTION */}
      <section id="about" className="py-24 px-4 sm:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center space-y-6">
        
        <div className="w-14 h-14 rounded-2xl bg-emerald-100/60 text-[#00C060] flex items-center justify-center shadow-inner">
          <Sprout className="w-7 h-7" />
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
          Why KisanMart?
        </h2>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl text-center mx-auto font-medium">
          Traditional agricultural supply chains can be complicated, slow and difficult to track. KisanMart aims to create a connected digital ecosystem where farmers can sell, shopkeepers can source, and delivery partners can transport produce efficiently.
        </p>

        {/* 4 Pill Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <span className="px-5 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            Farmers
          </span>
          <span className="px-5 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            Shopkeepers
          </span>
          <span className="px-5 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            Delivery Partners
          </span>
          <span className="px-5 py-2 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
            Fresh Produce
          </span>
        </div>

      </section>

      {/* 5. CALL TO ACTION STRIP */}
      <section className="bg-gradient-to-r from-[#00C060] via-[#00b057] to-[#009b4d] text-white py-20 px-4 sm:px-8 text-center space-y-7 shadow-2xl shadow-emerald-900/10">
        
        <div className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12]">
            Ready to grow with KisanMart?
          </h2>
          <p className="text-sm sm:text-base text-emerald-50 font-medium">
            Join the smarter way to connect farms, shops and delivery networks.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/login"
            className="px-7 py-3.5 rounded-xl bg-white text-[#00C060] hover:bg-emerald-50 text-xs sm:text-sm font-extrabold flex items-center gap-2 transition shadow-lg cursor-pointer hover:scale-105 transform duration-150"
          >
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/shop"
            className="px-7 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-900 text-white text-xs sm:text-sm font-extrabold transition shadow-md border border-emerald-700/50 cursor-pointer"
          >
            Explore Marketplace
          </Link>
        </div>

      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#00C060] flex items-center justify-center">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-slate-800 text-sm">KisanMart</span>
              <span className="text-[10px] font-bold text-slate-400 block tracking-wider">
                FARM • TRADE • DELIVER
              </span>
            </div>
          </div>

          <p>© 2026 KisanMart. All rights reserved.</p>

        </div>
      </footer>

    </div>
  );
}