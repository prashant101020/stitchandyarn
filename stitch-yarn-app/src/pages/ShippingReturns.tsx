import { FadeUp } from '@/components/UI';
import { formatPrice, siteSettings } from '@/data';

export function ShippingReturnsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <span className="font-script text-3xl text-primary block mb-2">shipping & returns</span>
          <h1 className="font-heading text-4xl font-semibold text-cocoa">
            Shipping & Returns
          </h1>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="prose-custom space-y-8">
          <section className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft">
            <h2 className="font-heading text-xl font-medium text-cocoa mb-4">📦 Processing Time</h2>
            <p className="text-sm text-cocoa-light leading-relaxed mb-3">
              Since every piece is handmade from scratch, orders take <strong className="text-cocoa">3–7 working days</strong> to craft. Made-to-order and personalised items may take a day or two extra — because we want it to be perfect for you.
            </p>
            <p className="text-sm text-cocoa-light leading-relaxed">
              You'll receive a WhatsApp update once your piece is ready and shipped.
            </p>
          </section>

          <section className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft">
            <h2 className="font-heading text-xl font-medium text-cocoa mb-4">🚚 Shipping</h2>
            <ul className="space-y-2 text-sm text-cocoa-light">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                We ship across all of India via trusted courier partners.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <strong className="text-cocoa">Free shipping</strong> on orders above {formatPrice(siteSettings.free_shipping_threshold)}.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                For orders below {formatPrice(siteSettings.free_shipping_threshold)}, a flat shipping fee of {formatPrice(siteSettings.shipping_cost)} applies.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Delivery typically takes <strong className="text-cocoa">3–5 working days</strong> after dispatch, depending on your location.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                Tracking details will be shared on WhatsApp once your order is shipped.
              </li>
            </ul>
          </section>

          <section className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft">
            <h2 className="font-heading text-xl font-medium text-cocoa mb-4">↩️ Returns & Exchanges</h2>
            <p className="text-sm text-cocoa-light leading-relaxed mb-3">
              Because each piece is handmade (and often personalised just for you), we generally <strong className="text-cocoa">do not accept returns or exchanges</strong>.
            </p>
            <p className="text-sm text-cocoa-light leading-relaxed mb-3">
              However, if your product arrives damaged during transit:
            </p>
            <ul className="space-y-2 text-sm text-cocoa-light">
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">✓</span>
                Contact us on WhatsApp within <strong className="text-cocoa">48 hours</strong> of delivery with clear photos.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">✓</span>
                We'll either repair, replace, or refund — whichever works best.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sage mt-1">✓</span>
                Please retain the original packaging until the issue is resolved.
              </li>
            </ul>
          </section>

          <section className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft">
            <h2 className="font-heading text-xl font-medium text-cocoa mb-4">❌ Cancellations</h2>
            <p className="text-sm text-cocoa-light leading-relaxed">
              Orders can be cancelled within <strong className="text-cocoa">12 hours</strong> of placing them, provided we haven't started crafting yet. Once work begins on a made-to-order piece, cancellations are not possible. Please message us on WhatsApp to request a cancellation.
            </p>
          </section>
        </div>
      </FadeUp>
    </main>
  );
}
