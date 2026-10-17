import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp } from '@/components/UI';
import { formatPrice, siteSettings } from '@/data';

const faqs = [
  {
    category: 'Orders & Shipping',
    items: [
      {
        q: 'How long does it take to receive my order?',
        a: `Since every piece is handmade, it takes 3–7 working days to craft your order, plus 3–5 days for shipping. You'll receive tracking updates on WhatsApp once it's shipped.`,
      },
      {
        q: 'Do you ship across India?',
        a: 'Yes! We ship to all states and union territories across India. International shipping is not available yet, but stay tuned.',
      },
      {
        q: 'Is shipping free?',
        a: `Shipping is free on orders above ${formatPrice(siteSettings.free_shipping_threshold)}. Below that, a flat shipping fee of ${formatPrice(siteSettings.shipping_cost)} applies.`,
      },
      {
        q: 'Can I track my order?',
        a: 'Absolutely! Once shipped, you\'ll get a tracking link on WhatsApp. You can also use the Track Order page on our website.',
      },
    ],
  },
  {
    category: 'Products & Personalisation',
    items: [
      {
        q: 'Are all products really handmade?',
        a: 'Every single piece is crocheted by hand by Deepa — no machines, no mass production. That\'s why each one has a unique, personal touch.',
      },
      {
        q: 'Can I get a custom piece made?',
        a: 'Yes! Head to the Custom Order page and tell us what you have in mind. Deepa will review your request and get back to you within 24 hours.',
      },
      {
        q: 'How does personalisation work for keychains?',
        a: 'When you add a keychain to your bag, you can enter your initial letter and choose your colour. Deepa will crochet that specific letter for you.',
      },
      {
        q: 'What colours are available?',
        a: 'Each product shows available colour options. If you want a specific colour not listed, just message us on WhatsApp — we\'ll try our best to accommodate.',
      },
    ],
  },
  {
    category: 'Payment & Returns',
    items: [
      {
        q: 'What payment options do you accept?',
        a: 'We accept UPI, debit/credit cards through Razorpay, and you can also order directly via WhatsApp with manual payment confirmation.',
      },
      {
        q: 'Can I return or exchange a product?',
        a: 'Since every piece is handmade (and often personalised), we don\'t accept returns. However, if your product arrives damaged, please contact us within 48 hours with photos and we\'ll sort it out.',
      },
      {
        q: 'What if I receive a damaged product?',
        a: 'Please send us photos on WhatsApp within 48 hours of delivery. We\'ll either repair, replace, or refund — whatever works best for you.',
      },
    ],
  },
  {
    category: 'Care & Maintenance',
    items: [
      {
        q: 'How do I care for crochet products?',
        a: 'Each product page has specific care instructions. In general: keep away from water, store flat, dust gently, and handle with love. They\'re handmade, so they appreciate a gentle touch.',
      },
      {
        q: 'Will the colours fade?',
        a: 'We use quality yarn that holds colour well. Avoid direct sunlight for long periods to keep the colours vibrant. Indoor display items will look beautiful for years.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-rose-line/15 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors gap-4"
        aria-expanded={open}
      >
        <span className="font-medium text-sm text-cocoa">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-cocoa-light shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-cocoa-light leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <span className="font-script text-3xl text-primary block mb-2">questions?</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-cocoa mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-cocoa-light">
            Everything you need to know. Can't find your answer? <a href={`https://wa.me/${siteSettings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">WhatsApp us</a>.
          </p>
        </div>
      </FadeUp>

      <div className="space-y-8">
        {faqs.map((section, i) => (
          <FadeUp key={section.category} delay={i * 0.1}>
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 shadow-soft">
              <h2 className="label-caps text-primary mb-4">{section.category}</h2>
              {section.items.map(item => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </FadeUp>
        ))}
      </div>
    </main>
  );
}
