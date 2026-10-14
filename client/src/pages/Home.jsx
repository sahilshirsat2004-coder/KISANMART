
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  MapPin,
  Search,
  ShoppingCart,
  Bell,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Truck,
  Heart,
  Plus,
  Home as HomeIcon,
  Store,
  Package,
  UserRound,
  SlidersHorizontal,
} from "lucide-react";

const categories = [
  { name: "All", emoji: "🛒" },
  { name: "Vegetables", emoji: "🥦" },
  { name: "Fruits", emoji: "🥭" },
  { name: "Grains", emoji: "🌾" },
  { name: "Pulses", emoji: "🫘" },
];

const products = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    category: "Vegetables",
    price: 20,
    unit: "kg",
    farmer: "Ramesh Patil",
    location: "Sawantwadi",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80",
    tag: "Fresh harvest",
  },
  {
    id: 2,
    name: "Farm Potatoes",
    category: "Vegetables",
    price: 18,
    unit: "kg",
    farmer: "Suresh Naik",
    location: "Kudal",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    tag: "Best value",
  },
  {
    id: 3,
    name: "Alphonso Mango",
    category: "Fruits",
    price: 80,
    unit: "kg",
    farmer: "Ganesh Sawant",
    location: "Devgad",
    stock: "Limited stock",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    tag: "Farm favourite",
  },
  {
    id: 4,
    name: "Fresh Carrots",
    category: "Vegetables",
    price: 25,
    unit: "kg",
    farmer: "Mahesh More",
    location: "Vengurla",
    stock: "In stock",
    image:
      "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=600&q=80",
    tag: "Fresh harvest",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState([]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" ||
        product.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.farmer.toLowerCase().includes(query) ||
        product.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();

    navigate(
      `/shop${
        searchQuery
          ? `?search=${encodeURIComponent(searchQuery)}`
          : ""
      }`
    );
  };

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F9F4] pb-24 font-sans text-slate-900 md:pb-8">

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-green-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
            aria-label="KisanMart home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-700 text-white">
              <Leaf size={24} />
            </span>

            <span className="text-xl font-black tracking-tight text-green-800">
              Kisan<span className="text-lime-600">Mart</span>
            </span>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => navigate("/")}
              className="font-semibold text-green-800"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="text-sm font-medium text-slate-600 hover:text-green-700"
            >
              Marketplace
            </button>

            <button
              onClick={() => navigate("/register?role=farmer")}
              className="text-sm font-medium text-slate-600 hover:text-green-700"
            >
              Sell Produce
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="hidden rounded-xl px-4 py-2 text-sm font-bold text-green-800 hover:bg-green-50 sm:block"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/shop")}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800"
              aria-label={`Shopping cart, ${cartCount} items`}
            >
              <ShoppingCart size={21} />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-white text-slate-600"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* ================= WELCOME SECTION ================= */}
        <section className="flex items-center justify-between py-5">
          <div>
            <button
              onClick={() => navigate("/shop")}
              className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-500"
            >
              <MapPin size={15} className="text-green-700" />
              Your local marketplace
              <ChevronRight size={14} />
            </button>

            <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
              Fresh finds,{" "}
              <span className="text-green-700">every day.</span>
            </h1>

            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Good produce. Fair prices. Direct from farmers.
            </p>
          </div>

          <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl sm:flex">
            🌱
          </div>
        </section>

        {/* ================= HERO BANNER ================= */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#075E37] via-[#087C46] to-[#3A9B4C] p-5 text-white shadow-lg shadow-green-900/10 sm:p-8">
          <div className="relative z-10 max-w-md">

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:text-xs">
              <Sprout size={14} />
              The smarter way to source
            </span>

            <h2 className="mt-4 max-w-xs text-2xl font-black leading-tight sm:text-4xl">
              From farm to shop,{" "}
              <span className="text-lime-300">
                the fresher way.
              </span>
            </h2>

            <p className="mt-2 max-w-xs text-xs leading-relaxed text-green-50 sm:text-sm">
              Discover fresh harvests, connect directly with growers
              and plan your next order.
            </p>

            <button
              onClick={() => navigate("/shop")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-green-800 shadow-md transition hover:bg-lime-50 sm:text-sm"
            >
              Explore marketplace
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-lime-300/15 blur-2xl sm:h-64 sm:w-64" />

          <div className="pointer-events-none absolute -bottom-4 right-0 text-[105px] opacity-90 sm:right-5 sm:text-[150px]">
            🧺
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 hidden rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm sm:block">
            <p className="text-xs font-bold">
              Farm-fresh sourcing
            </p>
            <p className="mt-1 text-[10px] text-green-100">
              Growers • Retailers • Delivery
            </p>
          </div>
        </section>

        {/* ================= SEARCH BAR ================= */}
        <form onSubmit={handleSearch} className="mt-5">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-100">

            <Search
              size={20}
              className="shrink-0 text-green-700"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search tomatoes, mangoes, farmers..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              aria-label="Search produce"
            />

            <button
              type="button"
              onClick={() => navigate("/shop")}
              className="rounded-lg bg-green-50 p-2 text-green-800"
              aria-label="Marketplace filters"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </form>

        {/* ================= CATEGORIES ================= */}
        <section className="mt-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-extrabold sm:text-lg">
              Shop by category
            </h2>

            <button
              onClick={() => navigate("/shop")}
              className="flex items-center gap-1 text-xs font-bold text-green-700"
            >
              View all <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const active =
                activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() =>
                    setActiveCategory(category.name)
                  }
                  className={`flex min-w-[82px] flex-col items-center gap-2 rounded-2xl border px-3 py-3 transition ${
                    active
                      ? "border-green-700 bg-green-700 text-white shadow-md shadow-green-900/10"
                      : "border-green-100 bg-white text-slate-700 hover:border-green-300"
                  }`}
                >
                  <span className="text-2xl">
                    {category.emoji}
                  </span>

                  <span className="whitespace-nowrap text-[11px] font-bold">
                    {category.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ================= BENEFITS ================= */}
        <section className="mt-5 grid grid-cols-3 gap-2">

          <div className="rounded-2xl border border-green-100 bg-green-50/70 p-3">
            <ShieldCheck size={19} className="text-green-700" />
            <p className="mt-2 text-[10px] font-extrabold sm:text-xs">
              Direct sourcing
            </p>
            <p className="mt-1 text-[9px] text-slate-500 sm:text-[11px]">
              Connect with growers
            </p>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-3">
            <Sprout size={19} className="text-orange-700" />
            <p className="mt-2 text-[10px] font-extrabold sm:text-xs">
              Fresh harvest
            </p>
            <p className="mt-1 text-[9px] text-slate-500 sm:text-[11px]">
              Source local produce
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3">
            <Truck size={19} className="text-blue-700" />
            <p className="mt-2 text-[10px] font-extrabold sm:text-xs">
              Order tracking
            </p>
            <p className="mt-1 text-[9px] text-slate-500 sm:text-[11px]">
              Follow deliveries
            </p>
          </div>
        </section>

        {/* ================= PRODUCTS ================= */}
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-700">
                Straight from the farm
              </p>

              <h2 className="mt-1 text-lg font-extrabold sm:text-xl">
                Popular produce
              </h2>
            </div>

            <button
              onClick={() => navigate("/shop")}
              className="flex items-center gap-1 text-xs font-bold text-green-700"
            >
              See all <ArrowRight size={15} />
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-5">

              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[1.15/1] overflow-hidden bg-green-50">

                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-2 top-2 rounded-lg bg-white/95 px-2 py-1 text-[9px] font-bold text-green-800 shadow-sm">
                      {product.tag}
                    </span>

                    <button
                      onClick={() =>
                        toggleFavorite(product.id)
                      }
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm"
                      aria-label={`${
                        favorites.includes(product.id)
                          ? "Remove from"
                          : "Add to"
                      } favorites: ${product.name}`}
                    >
                      <Heart
                        size={16}
                        className={
                          favorites.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-slate-500"
                        }
                      />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-extrabold leading-snug">
                      {product.name}
                    </p>

                    <div className="mt-1 flex items-baseline gap-1">
                      <span className="text-lg font-black text-green-800">
                        ₹{product.price}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        / {product.unit}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1 text-[10px] text-slate-500">
                      <MapPin
                        size={12}
                        className="shrink-0 text-green-700"
                      />
                      <span className="truncate">
                        {product.location}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-[10px] text-slate-500">
                      By {product.farmer}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-1">
                      <span className="text-[9px] font-semibold text-green-700">
                        {product.stock}
                      </span>

                      <button
                        onClick={() =>
                          setCartCount((count) => count + 1)
                        }
                        className="flex items-center gap-1 rounded-lg bg-green-700 px-2.5 py-2 text-[10px] font-extrabold text-white transition hover:bg-green-800"
                      >
                        <Plus size={13} />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-green-200 bg-white p-8 text-center">
              <span className="text-3xl">🔎</span>

              <p className="mt-3 font-bold">
                No produce found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or category.
              </p>

              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="mt-4 rounded-xl bg-green-700 px-4 py-2 text-sm font-bold text-white"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        {/* ================= ADVANCE BOOKING ================= */}
        <section className="mt-8 overflow-hidden rounded-3xl border border-lime-100 bg-[#EFF7E7] p-5 sm:flex sm:items-center sm:justify-between sm:p-7">

          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
              🌾
            </div>

            <div>
              <h2 className="text-base font-extrabold text-green-950">
                Plan your next harvest
              </h2>

              <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                Discover upcoming harvests and reserve produce in
                advance to plan your shop inventory.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/shop")}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-xs font-bold text-white sm:mt-0 sm:w-auto"
          >
            Explore harvests <ArrowRight size={16} />
          </button>
        </section>

        {/* ================= FARMER REGISTRATION ================= */}
        <section className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm sm:p-5">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
              <Sprout size={23} />
            </div>

            <div>
              <h3 className="text-sm font-extrabold">
                Are you a farmer?
              </h3>

              <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                Reach local shops and list your produce.
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              navigate("/register?role=farmer")
            }
            className="shrink-0 rounded-xl border border-green-200 px-3 py-2.5 text-[10px] font-extrabold text-green-800 hover:bg-green-50 sm:text-xs"
          >
            Join now
          </button>
        </section>

        {/* ================= FOOTER ================= */}
        <footer className="pb-5 pt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-green-800">
            <Leaf size={18} />
            <span className="font-black">KisanMart</span>
          </div>

          <p className="mt-2 text-[10px] text-slate-500">
            Connecting farmers, shops and local delivery partners.
          </p>

          <p className="mt-2 text-[10px] text-slate-400">
            © {new Date().getFullYear()} KisanMart
          </p>
        </footer>
      </main>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">

        <div className="mx-auto flex max-w-lg items-center justify-around">

          <button
            onClick={() => navigate("/")}
            className="flex min-w-14 flex-col items-center gap-1 py-1 text-green-800"
          >
            <HomeIcon size={21} />
            <span className="text-[10px] font-extrabold">
              Home
            </span>
          </button>

          <button
            onClick={() => navigate("/shop")}
            className="flex min-w-14 flex-col items-center gap-1 py-1 text-slate-500"
          >
            <Store size={21} />
            <span className="text-[10px] font-medium">
              Market
            </span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="relative flex min-w-14 flex-col items-center gap-1 py-1 text-slate-500"
          >
            <Package size={21} />

            {cartCount > 0 && (
              <span className="absolute right-2 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}

            <span className="text-[10px] font-medium">
              Orders
            </span>
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex min-w-14 flex-col items-center gap-1 py-1 text-slate-500"
          >
            <UserRound size={21} />
            <span className="text-[10px] font-medium">
              Profile
            </span>
          </button>

        </div>
      </nav>
    </div>
  );
}
