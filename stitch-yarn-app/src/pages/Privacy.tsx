import { FadeUp } from '@/components/UI';

export function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-semibold text-cocoa">Privacy Policy</h1>
          <p className="text-sm text-cocoa-light mt-2">Last updated: October 2026</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft space-y-6 text-sm text-cocoa-light leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">What We Collect</h2>
            <p>When you place an order or contact us, we collect your name, phone number, email address, and delivery address. This information is used solely to process and deliver your order.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">How We Use It</h2>
            <ul className="space-y-1 ml-4 list-disc">
              <li>To process and deliver your orders</li>
              <li>To communicate order updates via WhatsApp and email</li>
              <li>To respond to your queries and custom order requests</li>
              <li>To send you updates about new products (only if you opt in)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Data Storage</h2>
            <p>Your data is stored securely using Supabase (hosted on AWS). We do not sell, rent, or share your personal information with any third parties, except our courier partners for delivery purposes.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Payment Security</h2>
            <p>We do not store any payment card details. All payments are processed securely through Razorpay, which is PCI-DSS compliant. For WhatsApp orders, payment is handled directly between you and us via UPI.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Cookies</h2>
            <p>We use localStorage to persist your shopping bag. We do not use tracking cookies or third-party analytics that collect personal data.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Your Rights</h2>
            <p>You can request to see, update, or delete your personal data at any time by contacting us on WhatsApp or email. We'll respond within 48 hours.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Contact</h2>
            <p>For privacy-related queries, reach out to us at hello@stitchandyarn.in or message us on WhatsApp.</p>
          </section>
        </div>
      </FadeUp>
    </main>
  );
}
