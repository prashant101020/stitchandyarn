import { useState } from 'react';
import { Search, Package, Clock, Truck, Check, AlertCircle } from 'lucide-react';
import { FadeUp } from '@/components/UI';

type TrackStatus = 'new' | 'confirmed' | 'making' | 'shipped' | 'delivered';

const statusSteps: { key: TrackStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'confirmed', label: 'Order Confirmed', icon: <Check size={16} /> },
  { key: 'making', label: 'Being Handmade', icon: <Clock size={16} /> },
  { key: 'shipped', label: 'Shipped', icon: <Truck size={16} /> },
  { key: 'delivered', label: 'Delivered', icon: <Package size={16} /> },
];

export function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<{ status: TrackStatus; orderNumber: string } | null>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    // Mock: show a demo result
    if (orderId.trim() && phone.trim()) {
      setResult({ status: 'making', orderNumber: orderId.toUpperCase() });
    } else {
      setResult(null);
    }
  };

  const getStepIndex = (status: TrackStatus) =>
    statusSteps.findIndex(s => s.key === status);

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-10">
          <span className="font-script text-2xl text-primary block mb-1">track</span>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa mb-2">
            Track Your Order
          </h1>
          <p className="text-cocoa-light">Enter your order ID and phone number to see the status.</p>
        </div>

        <form onSubmit={handleTrack} className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft space-y-4 mb-10">
          <div>
            <label htmlFor="track-id" className="label-caps text-cocoa-light block mb-1.5">Order ID</label>
            <input
              id="track-id"
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="e.g. SY-20261012-001"
              className="w-full px-4 py-3 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="track-phone" className="label-caps text-cocoa-light block mb-1.5">Phone Number</label>
            <input
              id="track-phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-4 py-3 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full justify-center">
            <Search size={18} /> Track Order
          </button>
        </form>

        {searched && !result && (
          <div className="text-center py-10">
            <AlertCircle size={40} className="mx-auto text-rose-line mb-3" />
            <h3 className="font-heading text-lg font-medium text-cocoa mb-1">Order not found</h3>
            <p className="text-sm text-cocoa-light">Please check your order ID and phone number and try again.</p>
          </div>
        )}

        {result && (
          <FadeUp>
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <div className="text-center mb-6">
                <p className="label-caps text-cocoa-light">Order</p>
                <p className="font-heading text-xl font-semibold text-cocoa">{result.orderNumber}</p>
              </div>

              <div className="relative">
                {statusSteps.map((step, i) => {
                  const currentIdx = getStepIndex(result.status);
                  const isActive = i <= currentIdx;
                  const isCurrent = i === currentIdx;

                  return (
                    <div key={step.key} className="flex items-start gap-4 pb-8 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-primary text-cream' : 'bg-cream-dark text-cocoa-light'
                        } ${isCurrent ? 'ring-4 ring-blush' : ''}`}>
                          {step.icon}
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${isActive ? 'bg-primary' : 'bg-cream-dark'}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`font-medium text-sm ${isActive ? 'text-cocoa' : 'text-cocoa-light'}`}>
                          {step.label}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-primary mt-0.5">← Current status</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </FadeUp>
        )}
      </FadeUp>
    </main>
  );
}
