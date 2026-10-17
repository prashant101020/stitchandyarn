import { FadeUp } from '@/components/UI';

export function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-semibold text-cocoa">Terms of Service</h1>
          <p className="text-sm text-cocoa-light mt-2">Last updated: October 2026</p>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-soft space-y-6 text-sm text-cocoa-light leading-relaxed">
          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Overview</h2>
            <p>This website is operated by Stitch & Yarn by Deepa. By using this site and placing orders, you agree to the following terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Products</h2>
            <p>All products on this website are handmade crochet items. Due to the handmade nature, slight variations in colour, size, and shape are normal and part of the charm. Product photos are representative; your piece will be similar but uniquely yours.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Pricing</h2>
            <p>All prices are listed in Indian Rupees (₹) and include applicable taxes. Prices may change without prior notice, but any orders placed at a listed price will be honoured.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Orders</h2>
            <p>By placing an order, you confirm that the information provided is accurate. We reserve the right to cancel orders if we suspect fraudulent activity. For personalised items, please double-check your selections (letter, colour, etc.) as we cannot modify them once crafting has begun.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Intellectual Property</h2>
            <p>All designs, photographs, and content on this website are the property of Stitch & Yarn by Deepa. You may not reproduce, distribute, or use them for commercial purposes without written permission.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Limitation of Liability</h2>
            <p>Stitch & Yarn by Deepa is a small handmade business. While we strive for quality in every piece, we are not liable for any indirect or consequential damages arising from the use of our products.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-medium text-cocoa mb-2">Contact</h2>
            <p>For any questions about these terms, contact us at hello@stitchandyarn.in or via WhatsApp.</p>
          </section>
        </div>
      </FadeUp>
    </main>
  );
}
