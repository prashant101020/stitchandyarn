import { Link, useParams } from 'react-router-dom';
import { Check, Package, ArrowRight } from 'lucide-react';
import { FadeUp } from '@/components/UI';

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
      <FadeUp>
        <div className="w-20 h-20 mx-auto rounded-full bg-sage/15 flex items-center justify-center mb-6">
          <Check size={36} className="text-sage" />
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa mb-3">
          Order placed! 🎉
        </h1>
        {id === 'whatsapp' ? (
          <p className="text-cocoa-light leading-relaxed mb-8 max-w-md mx-auto">
            Your order details have been sent to Deepa via WhatsApp. She'll confirm your order and share payment details shortly. Keep an eye on your messages!
          </p>
        ) : (
          <p className="text-cocoa-light leading-relaxed mb-8 max-w-md mx-auto">
            Thank you for your order! You'll receive a confirmation on WhatsApp and email. Your order ID is <strong className="text-cocoa">{id}</strong>.
          </p>
        )}

        <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 text-left mb-8">
          <h3 className="font-heading text-lg font-medium text-cocoa mb-4 flex items-center gap-2">
            <Package size={18} className="text-primary" /> What happens next?
          </h3>
          <ol className="space-y-3">
            {[
              'Deepa confirms your order on WhatsApp',
              'Your piece is handmade with love (3–7 days)',
              'You get a shipping update with tracking',
              'Your handmade treasure arrives at your door!',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-cocoa-light">
                <span className="w-6 h-6 rounded-full bg-blush-light text-primary text-xs flex items-center justify-center shrink-0 font-semibold mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/shop" className="btn btn-primary">
            Continue shopping <ArrowRight size={16} />
          </Link>
          <Link to="/track-order" className="btn btn-secondary">
            Track your order
          </Link>
        </div>
      </FadeUp>
    </main>
  );
}
