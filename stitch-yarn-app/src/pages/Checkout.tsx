import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift, Truck, CreditCard, Tag, AlertCircle, Package, Sparkles, ShieldCheck, Lock, X, Loader2, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCartStore, useAuthStore } from '@/store';
import { formatPrice, siteSettings } from '@/data';
import { FadeUp } from '@/components/UI';
import type { Address } from '@/types';
import { submitDirectOrder } from '@/lib/supabase';
import { getRazorpayKey, loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay';

// Indian states for dropdown
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Chandigarh',
  'Jammu and Kashmir', 'Ladakh', 'Puducherry',
];

// Fuzzy matching to match API state names to dropdown list
function matchIndianState(rawState: string): string {
  if (!rawState) return '';
  const clean = rawState.toLowerCase().replace(/&/g, 'and').trim();
  const found = INDIAN_STATES.find(s => {
    const sClean = s.toLowerCase().replace(/&/g, 'and').trim();
    return sClean === clean || sClean.includes(clean) || clean.includes(sClean);
  });
  return found || rawState;
}

function validatePincode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin);
}

function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    items, getSubtotal, getShipping, getTotal,
    couponCode, couponDiscount, giftNote,
    setGiftNote, clearCart,
  } = useCartStore();
  const { customer } = useAuthStore();

  const [address, setAddress] = useState<Address>({
    full_name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address_line1: '', address_line2: '', city: '', state: '', pincode: '',
  });

  useEffect(() => {
    if (customer) {
      setAddress(prev => ({
        ...prev,
        full_name: customer.name || prev.full_name,
        phone: customer.phone || prev.phone,
        email: customer.email || prev.email,
      }));
    }
  }, [customer]);
  const [couponInput, setCouponInput] = useState('');
  const [showGiftNote, setShowGiftNote] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [showKeyNoticeModal, setShowKeyNoticeModal] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const pincodeCache = useRef<Record<string, { city: string; state: string }>>({});

  // Auto-fetch city & state from postalpincode API
  const fetchPincodeDetails = async (pin: string) => {
    if (pincodeCache.current[pin]) {
      const cached = pincodeCache.current[pin];
      setAddress(prev => ({
        ...prev,
        city: prev.city || cached.city,
        state: prev.state || cached.state,
      }));
      return;
    }

    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (
        Array.isArray(data) &&
        data[0]?.Status === 'Success' &&
        data[0]?.PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const po = data[0].PostOffice[0];
        const detectedCity = po.District || po.Division || po.Block || po.Name || '';
        const detectedState = matchIndianState(po.State || '');

        pincodeCache.current[pin] = { city: detectedCity, state: detectedState };

        setAddress(prev => ({
          ...prev,
          city: detectedCity,
          state: detectedState,
        }));

        setErrors(prev => {
          const next = { ...prev };
          delete next.pincode;
          if (detectedCity) delete next.city;
          if (detectedState) delete next.state;
          return next;
        });

        toast.success(`Auto-filled: ${detectedCity}, ${detectedState} 📍`, {
          icon: '📍',
          duration: 3000,
        });
      }
    } catch (err) {
      console.warn('Could not auto-fetch pincode details:', err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (val: string) => {
    const cleanPin = val.replace(/\D/g, '').slice(0, 6);
    setAddress(prev => ({ ...prev, pincode: cleanPin }));

    if (cleanPin.length === 6) {
      fetchPincodeDetails(cleanPin);
    }
  };

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h1 className="font-heading text-2xl font-semibold text-cocoa mb-2">Your bag is empty</h1>
        <p className="text-cocoa-light mb-6">Add some beautiful pieces before checking out.</p>
        <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
      </main>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!address.full_name.trim()) e.full_name = 'Name is required';
    if (!validatePhone(address.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (!validateEmail(address.email)) e.email = 'Enter a valid email';
    if (!address.address_line1.trim()) e.address_line1 = 'Address is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.state) e.state = 'Select your state';
    if (!validatePincode(address.pincode)) e.pincode = 'Enter a valid 6-digit PIN code';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleOrderViaWhatsApp = () => {
    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const itemLines = items.map(item => {
      let line = `• ${item.product.name} × ${item.quantity} — ${formatPrice(item.unit_price * item.quantity)}`;
      const variants = Object.entries(item.variant_selections);
      if (variants.length) line += `\n  ${variants.map(([k, v]) => `${k}: ${v}`).join(', ')}`;
      if (item.personalisation.initial_letter) line += `\n  Letter: ${item.personalisation.initial_letter}`;
      if (item.personalisation.name_text) line += `\n  Name: ${item.personalisation.name_text}`;
      return line;
    });

    const msg = [
      `Hi Deepa! 💕 New order:`,
      '',
      `📦 Items:`,
      ...itemLines,
      '',
      `💰 Subtotal: ${formatPrice(subtotal)}`,
      couponDiscount > 0 ? `🏷️ Discount (${couponCode}): -${formatPrice(couponDiscount)}` : '',
      `🚚 Shipping: ${shipping === 0 ? 'Free!' : formatPrice(shipping)}`,
      `✨ Total: ${formatPrice(total)}`,
      '',
      `📍 Deliver to:`,
      `${address.full_name}`,
      `${address.address_line1}${address.address_line2 ? ', ' + address.address_line2 : ''}`,
      `${address.city}, ${address.state} — ${address.pincode}`,
      `📱 ${address.phone}`,
      `📧 ${address.email}`,
      giftNote ? `\n🎁 Gift note: ${giftNote}` : '',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(msg)}`, '_blank');
    clearCart();
    navigate('/order-confirmation/whatsapp');
  };

  // Places order only after successful payment is confirmed
  const executeOrderPlacement = async (
    razorpayPaymentId?: string,
    razorpayOrderId?: string
  ) => {
    setProcessing(true);

    try {
      const res = await submitDirectOrder({
        customerId: customer?.id,
        address,
        items,
        subtotal,
        discount: couponDiscount,
        shipping,
        total,
        couponCode,
        giftNote,
        paymentMethod: 'razorpay',
        paymentStatus: 'paid',
        razorpayPaymentId,
        razorpayOrderId,
      });

      if (res.error) {
        toast.error(res.error || 'Failed to place order. Please try again.');
        setProcessing(false);
        return;
      }

      if (res.order) {
        clearCart();
        toast.success('Payment received! Your order has been placed 🎉', { duration: 5000 });
        navigate(`/order-confirmation/${res.order.order_number}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      toast.error(msg);
    } finally {
      setProcessing(false);
    }
  };

  // Launch Razorpay Payment Gateway
  const handlePayWithRazorpay = async () => {
    if (!validate()) {
      toast.error('Please fill in all required delivery fields');
      return;
    }

    const keyId = getRazorpayKey();

    // If Razorpay Key is not yet configured in .env, show helpful setup modal with test payment simulation
    if (!keyId) {
      setShowKeyNoticeModal(true);
      return;
    }

    setProcessing(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Could not connect to Razorpay payment gateway. Please check your internet connection.');
      setProcessing(false);
      return;
    }

    try {
      openRazorpayCheckout({
        keyId,
        amountInRupees: total,
        customerName: address.full_name,
        customerEmail: address.email,
        customerPhone: address.phone,
        itemCount: items.length,
        deliveryCity: address.city,
        giftNote,
        onSuccess: async (response) => {
          // Payment confirmed by Razorpay! Only now confirm and insert order
          await executeOrderPlacement(
            response.razorpay_payment_id,
            response.razorpay_order_id
          );
        },
        onDismiss: () => {
          setProcessing(false);
          toast('Payment was cancelled. Your items are still safe in your cart.', { icon: 'ℹ️' });
        },
        onError: (err) => {
          setProcessing(false);
          const desc = err?.description || err?.message || 'Payment failed or declined. Please try again.';
          toast.error(desc);
        },
      });
    } catch (err: unknown) {
      setProcessing(false);
      const msg = err instanceof Error ? err.message : 'Failed to launch Razorpay';
      toast.error(msg);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <FadeUp>
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-cocoa-light hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Continue shopping
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa mb-8">Checkout</h1>
      </FadeUp>

      <div className="grid md:grid-cols-5 gap-8 md:gap-12">
        {/* Form */}
        <div className="md:col-span-3 space-y-8">
          {/* Contact & Address */}
          <FadeUp delay={0.1}>
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <h2 className="font-heading text-xl font-medium text-cocoa mb-5 flex items-center gap-2">
                <Truck size={20} className="text-primary" /> Delivery Details
              </h2>
              {!customer && (
                <div className="mb-5 p-3 bg-blush-light/50 border border-rose-line/30 rounded-xl flex items-center justify-between text-xs text-cocoa">
                  <span>Already have a Stitch & Yarn account?</span>
                  <Link
                    to="/login"
                    state={{ from: '/checkout' }}
                    className="text-primary font-semibold hover:underline shrink-0 ml-2"
                  >
                    Sign in to prefill →
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Full Name *" id="full_name" value={address.full_name} error={errors.full_name}
                  onChange={v => setAddress(a => ({ ...a, full_name: v }))} placeholder="Priya Sharma" />
                <InputField label="Phone *" id="phone" value={address.phone} error={errors.phone} type="tel"
                  onChange={v => setAddress(a => ({ ...a, phone: v }))} placeholder="9876543210" />
                <InputField label="Email *" id="email" value={address.email} error={errors.email} type="email" className="sm:col-span-2"
                  onChange={v => setAddress(a => ({ ...a, email: v }))} placeholder="priya@example.com" />
                <InputField label="Address Line 1 *" id="address1" value={address.address_line1} error={errors.address_line1} className="sm:col-span-2"
                  onChange={v => setAddress(a => ({ ...a, address_line1: v }))} placeholder="House/Flat No., Building, Street" />
                <InputField label="Address Line 2" id="address2" value={address.address_line2 || ''} className="sm:col-span-2"
                  onChange={v => setAddress(a => ({ ...a, address_line2: v }))} placeholder="Landmark, Area (optional)" />
                <InputField
                  label="PIN Code *"
                  id="pincode"
                  value={address.pincode}
                  error={errors.pincode}
                  loading={pincodeLoading}
                  hint={
                    pincodeLoading
                      ? 'Fetching city & state...'
                      : address.pincode.length === 6 && address.city
                      ? '✓ City & State auto-filled'
                      : 'Auto-fills City & State'
                  }
                  onChange={handlePincodeChange}
                  placeholder="400001"
                />
                <InputField
                  label="City *"
                  id="city"
                  value={address.city}
                  error={errors.city}
                  onChange={v => setAddress(a => ({ ...a, city: v }))}
                  placeholder="Mumbai"
                />
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="state" className="label-caps text-cocoa-light block">State *</label>
                    {address.state && (
                      <span className="text-[10px] text-sage font-medium">Selected</span>
                    )}
                  </div>
                  <select
                    id="state"
                    value={address.state}
                    onChange={e => setAddress(a => ({ ...a, state: e.target.value }))}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-cream text-cocoa focus:outline-none text-sm transition-colors ${
                      errors.state ? 'border-red-400 focus:border-red-500' : 'border-rose-line/40 focus:border-primary'
                    }`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors.state}</p>}
                </div>
              </div>
            </div>
          </FadeUp>

          {/* Gift note */}
          <FadeUp delay={0.15}>
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <button
                onClick={() => setShowGiftNote(!showGiftNote)}
                className="flex items-center gap-2 text-cocoa hover:text-primary transition-colors w-full"
              >
                <Gift size={18} className="text-primary" />
                <span className="font-medium text-sm">Add a gift note</span>
              </button>
              {showGiftNote && (
                <textarea
                  value={giftNote}
                  onChange={e => setGiftNote(e.target.value)}
                  placeholder="Write a sweet message for the lucky person..."
                  rows={3}
                  maxLength={200}
                  className="mt-3 w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm resize-none"
                />
              )}
            </div>
          </FadeUp>

          {/* Coupon */}
          <FadeUp delay={0.2}>
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={18} className="text-primary" />
                <span className="font-medium text-sm text-cocoa">Have a coupon?</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm uppercase tracking-wider"
                />
                <button
                  onClick={() => {
                    if (couponInput === 'FIRST10') {
                      const discount = Math.round(subtotal * 0.1);
                      useCartStore.getState().setCoupon('FIRST10', discount);
                      toast.success(`Coupon applied! ₹${discount} off`);
                    } else {
                      toast.error('Invalid coupon code');
                    }
                  }}
                  className="btn btn-secondary text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Order Summary sidebar */}
        <FadeUp delay={0.2} className="md:col-span-2">
          <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-card sticky top-24">
            <h2 className="font-heading text-xl font-medium text-cocoa mb-5">Order Summary</h2>

            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cocoa truncate">{item.product.name}</p>
                    <p className="text-xs text-cocoa-light">Qty: {item.quantity}</p>
                    {item.personalisation.initial_letter && (
                      <p className="text-xs text-primary">Letter: {item.personalisation.initial_letter}</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-cocoa whitespace-nowrap">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-rose-line/10">
              <div className="flex justify-between text-sm">
                <span className="text-cocoa-light">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-sage">
                  <span>Discount ({couponCode})</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-cocoa-light">Shipping</span>
                <span>{shipping === 0 ? <span className="text-sage">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-3 border-t border-rose-line/10">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment buttons */}
            <div className="mt-6 space-y-3">
              {/* Option 1: Pay Online via Razorpay */}
              <button
                type="button"
                onClick={handlePayWithRazorpay}
                disabled={processing}
                className="btn btn-primary w-full justify-center gap-2 py-3.5 text-sm font-semibold shadow-card hover:shadow-glow disabled:opacity-50 cursor-pointer"
              >
                {processing ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pay Online (UPI / Cards / Netbanking) ✨
                  </>
                )}
              </button>

              {/* Payment trust indicators */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-cocoa-light/75 font-medium pt-0.5">
                <ShieldCheck size={14} className="text-sage shrink-0" />
                <span>UPI (GPay, PhonePe, Paytm) • Cards • 100% Secured by Razorpay</span>
              </div>

              <div className="relative py-1 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-rose-line/20" />
                </div>
                <span className="relative bg-surface px-3 text-[11px] font-semibold uppercase tracking-wider text-cocoa-light/60">
                  Or
                </span>
              </div>

              {/* Option 2: Order via WhatsApp */}
              <button
                type="button"
                onClick={handleOrderViaWhatsApp}
                disabled={processing}
                className="btn w-full justify-center gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a] disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order via WhatsApp
              </button>

            </div>

            <p className="text-xs text-cocoa-light/60 text-center mt-4">
              By placing this order you agree to our{' '}
              <Link to="/terms" className="underline hover:text-primary">terms</Link> and{' '}
              <Link to="/privacy" className="underline hover:text-primary">privacy policy</Link>.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* Razorpay Setup Guidance & Instant Test Simulation Modal */}
      {showKeyNoticeModal && (
        <div className="fixed inset-0 bg-cocoa/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-line/30 shadow-elevated space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-blush-light text-primary flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <button
                type="button"
                onClick={() => setShowKeyNoticeModal(false)}
                className="p-1.5 rounded-lg text-cocoa-light hover:text-cocoa"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-cocoa">Razorpay Gateway Ready</h3>
              <p className="text-xs text-cocoa-light mt-1.5 leading-relaxed">
                To accept real UPI & card payments on your live site, add your{' '}
                <span className="font-mono bg-cream px-1.5 py-0.5 rounded text-primary text-[11px]">
                  RAZORPAY_KEY_ID
                </span>{' '}
                to your environment variables.
              </p>
            </div>

            <div className="bg-cream/60 rounded-2xl p-4 border border-rose-line/20 text-xs text-cocoa space-y-1.5">
              <p className="font-semibold text-cocoa flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary" /> Test the full flow right now:
              </p>
              <p className="text-cocoa-light">
                Click below to simulate a successful payment. Your order will be confirmed in Supabase, appear in the customer's profile, and show up on the Admin dashboard!
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowKeyNoticeModal(false);
                  executeOrderPlacement('pay_simulated_' + Math.random().toString(36).substring(2, 9));
                }}
                className="btn btn-primary w-full justify-center text-sm py-2.5"
              >
                Simulate Successful Payment (Test) ✨
              </button>
              <button
                type="button"
                onClick={() => setShowKeyNoticeModal(false)}
                className="btn btn-ghost w-full justify-center text-sm text-cocoa-light py-2"
              >
                Back to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// Reusable input field component
function InputField({
  label, id, value, onChange, error, placeholder = '', type = 'text', className = '',
  loading = false, hint = '',
}: {
  label: string; id: string; value: string; onChange: (v: string) => void;
  error?: string; placeholder?: string; type?: string; className?: string;
  loading?: boolean; hint?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="label-caps text-cocoa-light block">{label}</label>
        {hint && !error && (
          <span className="text-[10px] text-cocoa-light/75 font-medium">{hint}</span>
        )}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 rounded-xl border bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:outline-none text-sm transition-colors ${
            loading ? 'pr-10' : ''
          } ${
            error ? 'border-red-400 focus:border-red-500' : 'border-rose-line/40 focus:border-primary'
          }`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            <Loader2 size={16} className="animate-spin" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          <AlertCircle size={12} />{error}
        </p>
      )}
    </div>
  );
}
