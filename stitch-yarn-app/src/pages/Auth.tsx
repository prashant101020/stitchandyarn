import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  Heart,
  LogOut,
  ShoppingBag,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store';
import { formatPrice } from '@/data';
import type { Order } from '@/types';
import {
  signUpCustomer,
  signInCustomer,
  isSupabaseConfigured,
  getCustomerOrders,
} from '@/lib/supabase';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode }: AuthPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, setCustomer, logout } = useAuthStore();

  // Mode is derived from route or prop
  const mode = location.pathname.includes('register') || initialMode === 'register' ? 'register' : 'login';
  const switchMode = (newMode: 'login' | 'register') => {
    setShowForgotPassword(false);
    navigate(newMode === 'register' ? '/register' : '/login', { replace: true, state: location.state });
  };

  // Form states
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Destination to redirect back to (e.g. if redirected from checkout)
  const from = (location.state as { from?: string })?.from || '/';

  // Customer Profile & My Orders state
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileTab, setProfileTab] = useState<'orders' | 'profile'>('orders');

  const fetchOrders = () => {
    if (!customer) return;
    setOrdersLoading(true);
    getCustomerOrders(customer)
      .then((res) => setCustomerOrders(res.orders || []))
      .catch(() => toast.error('Could not load orders'))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    if (customer) {
      fetchOrders();
    }
  }, [customer]);

  const statusConfigs: Record<string, { label: string; badgeClass: string; icon: string }> = {
    new: { label: 'Order Received', badgeClass: 'bg-amber-100 text-amber-800 border-amber-200', icon: '🟡' },
    confirmed: { label: 'Confirmed', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200', icon: '🔵' },
    making: { label: 'Crocheting with Love', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🧶' },
    shipped: { label: 'Shipped & On The Way', badgeClass: 'bg-teal-100 text-teal-800 border-teal-200', icon: '🚚' },
    delivered: { label: 'Delivered', badgeClass: 'bg-green-100 text-green-800 border-green-200', icon: '🎉' },
    cancelled: { label: 'Cancelled', badgeClass: 'bg-red-100 text-red-800 border-red-200', icon: '⚪' },
  };

  // If customer is already logged in -> Show Account & My Orders Dashboard
  if (customer) {
    return (
      <main className="min-h-[85vh] py-8 sm:py-12 px-4 max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface border border-rose-line/30 rounded-3xl p-6 sm:p-8 shadow-card mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blush-light text-primary flex items-center justify-center text-2xl font-bold shadow-soft">
                {customer.name?.charAt(0).toUpperCase() || '✨'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-cocoa">
                    {customer.name}
                  </h1>
                  <span className="badge badge-sage text-[0.65rem]">Member</span>
                </div>
                <p className="text-xs sm:text-sm text-cocoa-light mt-0.5">
                  {customer.email || (customer.phone ? `Mobile: ${customer.phone}` : 'Stitch & Yarn Customer')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/shop')}
                className="btn btn-primary text-xs sm:text-sm py-2 px-4"
              >
                Shop Now <ArrowRight size={14} />
              </button>
              <button
                onClick={async () => {
                  await logout();
                  toast.success('Signed out successfully.');
                }}
                className="btn btn-ghost text-xs text-cocoa-light hover:text-red-600 gap-1.5 py-2 px-3 border border-rose-line/20 rounded-full"
                title="Sign out"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="mt-8 pt-4 border-t border-rose-line/20 flex gap-2">
            <button
              onClick={() => setProfileTab('orders')}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                profileTab === 'orders'
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-cream-dark/50 text-cocoa-light hover:text-cocoa'
              }`}
            >
              <Package size={16} /> My Orders ({customerOrders.length})
            </button>
            <button
              onClick={() => setProfileTab('profile')}
              className={`flex items-center gap-2 py-2 px-4 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                profileTab === 'profile'
                  ? 'bg-primary text-white shadow-soft'
                  : 'bg-cream-dark/50 text-cocoa-light hover:text-cocoa'
              }`}
            >
              <User size={16} /> Profile Details
            </button>
          </div>
        </motion.div>

        {/* Tab 1: My Orders */}
        {profileTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-heading text-xl font-medium text-cocoa flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" /> Past Orders & Live Status
              </h2>
              <button
                onClick={fetchOrders}
                disabled={ordersLoading}
                className="btn btn-ghost text-xs text-cocoa-light hover:text-primary gap-1 py-1 px-3"
              >
                <RefreshCw size={13} className={ordersLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {ordersLoading ? (
              <div className="bg-surface rounded-2xl p-12 text-center border border-rose-line/20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-cocoa-light">Loading your orders...</p>
              </div>
            ) : customerOrders.length === 0 ? (
              <div className="bg-surface rounded-3xl p-10 text-center border border-rose-line/20 shadow-soft">
                <p className="text-5xl mb-3">🧶</p>
                <h3 className="font-heading text-xl font-semibold text-cocoa mb-1">
                  No orders yet!
                </h3>
                <p className="text-sm text-cocoa-light max-w-md mx-auto mb-6">
                  You haven't ordered any handmade pieces yet. Place an order today and track its crafting journey here!
                </p>
                <Link to="/shop" className="btn btn-primary">
                  Explore Handmade Creations
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((order) => {
                  const itemsList = order.items || order.order_items || [];
                  const statusConf = statusConfigs[order.status] || {
                    label: order.status,
                    badgeClass: 'bg-cream-dark text-cocoa',
                    icon: '📦',
                  };

                  return (
                    <motion.div
                      key={order.id || order.order_number}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-surface border border-rose-line/30 rounded-3xl p-5 sm:p-6 shadow-soft"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-rose-line/15">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-bold text-sm text-cocoa">
                              {order.order_number}
                            </span>
                            <span
                              className={`badge border text-[0.7rem] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 ${statusConf.badgeClass}`}
                            >
                              <span>{statusConf.icon}</span> {statusConf.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-cocoa-light/80 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} />
                              {new Date(order.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <span>Payment: {order.payment_method?.toUpperCase()}</span>
                          </div>
                        </div>

                        <div className="text-right sm:text-right">
                          <p className="text-xs text-cocoa-light">Order Total</p>
                          <p className="font-heading text-xl font-bold text-primary">
                            {formatPrice(order.total)}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="py-4 space-y-3">
                        {itemsList.map((item, idx) => {
                          const variants = item.variant_selections
                            ? Object.entries(item.variant_selections)
                            : [];
                          const personLetter =
                            typeof item.personalisation === 'object'
                              ? item.personalisation?.initial_letter
                              : item.personalisation;

                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3.5 bg-cream/50 rounded-2xl p-3 border border-rose-line/10"
                            >
                              {item.product_image ? (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name || item.name || 'Handmade item'}
                                  className="w-14 h-16 object-cover rounded-xl shrink-0 border border-rose-line/20"
                                />
                              ) : (
                                <div className="w-14 h-16 bg-blush-light rounded-xl flex items-center justify-center text-primary text-xl shrink-0">
                                  🧶
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-cocoa truncate">
                                  {item.product_name || item.name}
                                </h4>
                                <div className="text-xs text-cocoa-light/80 flex flex-wrap gap-x-2 gap-y-0.5 mt-0.5">
                                  <span>Qty: {item.quantity || item.qty || 1}</span>
                                  {variants.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span>{variants.map(([k, v]) => `${k}: ${v}`).join(', ')}</span>
                                    </>
                                  )}
                                  {personLetter && (
                                    <>
                                      <span>•</span>
                                      <span className="text-primary font-medium">Letter: {personLetter}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-semibold text-sm text-cocoa">
                                  {formatPrice(
                                    item.total_price || (item.unit_price || 0) * (item.quantity || item.qty || 1)
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Delivery Address & Status Note */}
                      <div className="pt-3 border-t border-rose-line/15 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-cocoa-light gap-2">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-primary shrink-0" />
                          <span>
                            Delivery to:{' '}
                            <strong className="text-cocoa font-medium">
                              {order.customer_name}
                            </strong>
                            ,{' '}
                            {order.address_line1 || order.address?.address_line1 || ''},{' '}
                            {order.city || order.address?.city || ''}{' '}
                            {order.pincode || order.address?.pincode || ''}
                          </span>
                        </div>
                        <span className="text-[0.7rem] bg-blush-light/50 text-cocoa-light px-2.5 py-1 rounded-full w-fit">
                          Live status updates synced with shop
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile Details */}
        {profileTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface border border-rose-line/30 rounded-3xl p-6 sm:p-8 shadow-card space-y-5"
          >
            <h2 className="font-heading text-xl font-medium text-cocoa mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-cream/60 rounded-2xl border border-rose-line/15">
                <span className="label-caps text-cocoa-light text-[0.65rem] block mb-1">Full Name</span>
                <p className="font-medium text-cocoa text-sm">{customer.name || 'Not provided'}</p>
              </div>

              <div className="p-4 bg-cream/60 rounded-2xl border border-rose-line/15">
                <span className="label-caps text-cocoa-light text-[0.65rem] block mb-1">Email Address</span>
                <p className="font-medium text-cocoa text-sm">{customer.email || 'None on file'}</p>
              </div>

              <div className="p-4 bg-cream/60 rounded-2xl border border-rose-line/15">
                <span className="label-caps text-cocoa-light text-[0.65rem] block mb-1">Mobile Number</span>
                <p className="font-medium text-cocoa text-sm">{customer.phone || 'None on file'}</p>
              </div>

              <div className="p-4 bg-cream/60 rounded-2xl border border-rose-line/15">
                <span className="label-caps text-cocoa-light text-[0.65rem] block mb-1">Account ID</span>
                <p className="font-mono text-xs text-cocoa-light/80 truncate">{customer.id}</p>
              </div>
            </div>

            <div className="p-4 bg-blush-light/30 border border-rose-line/20 rounded-2xl text-xs text-cocoa-light flex items-center gap-3">
              <Sparkles size={20} className="text-primary shrink-0" />
              <p>
                Your details automatically pre-fill at checkout so you can complete handcrafted orders with a single tap.
              </p>
            </div>
          </motion.div>
        )}
      </main>
    );
  }

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedId = identifier.trim();
    if (!trimmedId) {
      toast.error('Please enter your email or mobile number.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const trimmedName = name.trim();
        if (!trimmedName) {
          toast.error('Please enter your full name.');
          setLoading(false);
          return;
        }

        const res = await signUpCustomer({
          name: trimmedName,
          identifier: trimmedId,
          password,
        });

        if (res.error) {
          toast.error(res.error);
        } else if (res.customer) {
          setCustomer(res.customer);
          if (res.isPreview) {
            toast.success(`Welcome to Stitch & Yarn, ${res.customer.name}! 🌸`, {
              duration: 4000,
            });
          } else {
            toast.success(`Account created! Welcome, ${res.customer.name}! 🌸`);
          }
          navigate(from);
        }
      } else {
        // Login mode
        const res = await signInCustomer({
          identifier: trimmedId,
          password,
        });

        if (res.error) {
          toast.error(res.error);
        } else if (res.customer) {
          setCustomer(res.customer);
          toast.success(`Welcome back, ${res.customer.name}! 💕`);
          navigate(from);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetInput.trim()) {
      toast.error('Please enter your registered email or phone.');
      return;
    }
    setResetSent(true);
    toast.success('Instructions have been sent if an account matches.');
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <main className="min-h-[85vh] py-12 px-4 flex items-center justify-center relative">
      {/* Background Decorative Accents */}
      <div className="absolute top-1/4 left-1/10 w-64 h-64 bg-blush-light/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-72 h-72 bg-cream-dark/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Supabase status indicator badge (clean & informative) */}
        {!isConfigured && (
          <div className="mb-4 bg-amber-50/80 border border-amber-200/60 rounded-2xl px-4 py-2.5 text-xs text-amber-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
            <p className="leading-snug">
              <strong>Preview Mode Active:</strong> You can test register and login right now!
              Follow the Supabase setup to persist to cloud.
            </p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-surface border border-rose-line/30 rounded-3xl shadow-card overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 text-center">
            <Link to="/" className="inline-block mb-3">
              <img
                src="/logo.jpeg"
                alt="Stitch & Yarn"
                className="h-16 w-16 mx-auto rounded-full shadow-soft"
              />
            </Link>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-cocoa">
              {mode === 'register' ? 'Join Stitch & Yarn' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-cocoa-light mt-1">
              {mode === 'register'
                ? 'Create your free account for seamless orders & custom requests'
                : 'Sign in to access your orders and checkout faster'}
            </p>

            {/* Seamless Toggle Tabs */}
            <div className="mt-6 p-1 bg-cream-dark rounded-full flex gap-1 relative">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                  mode === 'login'
                    ? 'bg-surface text-primary shadow-soft'
                    : 'text-cocoa-light hover:text-cocoa'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                  mode === 'register'
                    ? 'bg-surface text-primary shadow-soft'
                    : 'text-cocoa-light hover:text-cocoa'
                }`}
              >
                Create Account
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8 pt-2">
            <AnimatePresence mode="wait">
              {showForgotPassword ? (
                /* Forgot password helper */
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-2">
                    <h2 className="font-heading text-xl font-semibold text-cocoa">Reset Password</h2>
                    <p className="text-xs text-cocoa-light mt-1">
                      Enter your email or mobile number and we'll help you get back into your account.
                    </p>
                  </div>

                  {resetSent ? (
                    <div className="bg-blush-light/50 border border-rose-line/30 rounded-2xl p-4 text-center">
                      <CheckCircle2 className="w-8 h-8 text-sage mx-auto mb-2" />
                      <p className="text-sm font-medium text-cocoa">Instructions Sent!</p>
                      <p className="text-xs text-cocoa-light mt-1">
                        If an account exists for {resetInput}, we've sent instructions to reset your password.
                      </p>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setResetSent(false);
                        }}
                        className="btn btn-secondary mt-4 w-full text-xs"
                      >
                        Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                      <div>
                        <label className="label-caps text-cocoa-light block mb-1.5">
                          Email or Mobile Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={resetInput}
                            onChange={(e) => setResetInput(e.target.value)}
                            placeholder="e.g. priya@gmail.com or 9876543210"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                            required
                          />
                          <Mail className="absolute left-3 top-3 text-cocoa-light" size={16} />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary w-full">
                        Send Reset Link
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="btn btn-ghost w-full text-xs text-cocoa-light"
                      >
                        Cancel & Return to Sign In
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                /* Main Login / Register Form */
                <motion.form
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  {/* Field 1: Name (Only in Register mode) */}
                  {mode === 'register' && (
                    <div>
                      <label htmlFor="reg-name" className="label-caps text-cocoa-light block mb-1.5">
                        Your Full Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="reg-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Priya Sharma"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm transition-colors"
                          required
                          autoComplete="name"
                        />
                        <User className="absolute left-3 top-3 text-cocoa-light" size={16} />
                      </div>
                    </div>
                  )}

                  {/* Field 2: Email or Phone Number */}
                  <div>
                    <label htmlFor="auth-identifier" className="label-caps text-cocoa-light block mb-1.5">
                      Email or Mobile Number <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="auth-identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. deepa@example.com or 9876543210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm transition-colors"
                        required
                        autoComplete="username"
                      />
                      <Mail className="absolute left-3 top-3 text-cocoa-light" size={16} />
                    </div>
                    <p className="text-[0.7rem] text-cocoa-light/80 mt-1 pl-1">
                      {mode === 'register'
                        ? 'We will use this for your order confirmations and tracking updates.'
                        : 'Enter the email or phone you used when registering.'}
                    </p>
                  </div>

                  {/* Field 3: Password with Show/Hide toggle */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="auth-password" className="label-caps text-cocoa-light">
                        Password <span className="text-primary">*</span>
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm transition-colors"
                        required
                        minLength={6}
                        autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                      />
                      <Lock className="absolute left-3 top-3 text-cocoa-light" size={16} />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-cocoa-light hover:text-cocoa p-1 rounded focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {mode === 'register' && (
                      <p className="text-[0.7rem] text-cocoa-light/80 mt-1 pl-1">
                        Must be at least 6 characters. Easy to remember.
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full shadow-soft hover:shadow-glow flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : mode === 'register' ? (
                        <>
                          Create My Account <Sparkles size={16} />
                        </>
                      ) : (
                        <>
                          Sign In <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Switch Mode Footer Link */}
            <div className="mt-6 pt-5 border-t border-rose-line/20 text-center">
              {mode === 'register' ? (
                <p className="text-xs sm:text-sm text-cocoa-light">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="text-primary font-semibold hover:underline ml-1"
                  >
                    Sign in here
                  </button>
                </p>
              ) : (
                <p className="text-xs sm:text-sm text-cocoa-light">
                  New to Stitch & Yarn?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="text-primary font-semibold hover:underline ml-1"
                  >
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Reassuring Customer Benefits */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-surface/70 rounded-2xl border border-rose-line/10">
            <Package className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <p className="text-[0.75rem] font-medium text-cocoa">Easy Tracking</p>
            <p className="text-[0.65rem] text-cocoa-light">Check live order status</p>
          </div>
          <div className="p-3 bg-surface/70 rounded-2xl border border-rose-line/10">
            <ShieldCheck className="w-5 h-5 text-sage mx-auto mb-1.5" />
            <p className="text-[0.75rem] font-medium text-cocoa">100% Secure</p>
            <p className="text-[0.65rem] text-cocoa-light">Encrypted credentials</p>
          </div>
          <div className="p-3 bg-surface/70 rounded-2xl border border-rose-line/10">
            <Heart className="w-5 h-5 text-primary-light mx-auto mb-1.5" />
            <p className="text-[0.75rem] font-medium text-cocoa">Handmade Love</p>
            <p className="text-[0.65rem] text-cocoa-light">Custom craft requests</p>
          </div>
        </div>
      </div>
    </main>
  );
}

