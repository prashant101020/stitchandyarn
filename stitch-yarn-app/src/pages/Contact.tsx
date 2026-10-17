import { Mail, MessageCircle, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from '@/components/Motifs';
import { FadeUp } from '@/components/UI';
import { siteSettings } from '@/data';

export function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <FadeUp>
        <div className="text-center mb-12">
          <span className="font-script text-3xl text-primary block mb-2">get in touch</span>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-cocoa mb-3">
            Let's Chat
          </h1>
          <p className="text-cocoa-light max-w-md mx-auto">
            Have a question, want to collaborate, or just want to say hello? I'd love to hear from you.
          </p>
        </div>
      </FadeUp>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact methods */}
        <FadeUp delay={0.1}>
          <div className="space-y-4">
            <a
              href={`https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent('Hi Deepa! 💕')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-rose-line/20 shadow-soft hover:shadow-card transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle size={22} className="text-[#25D366]" />
              </div>
              <div>
                <p className="font-medium text-cocoa">WhatsApp</p>
                <p className="text-sm text-cocoa-light">Fastest way to reach me — usually reply within an hour</p>
              </div>
            </a>

            <a
              href={siteSettings.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-rose-line/20 shadow-soft hover:shadow-card transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <InstagramIcon size={22} className="text-pink-500" />
              </div>
              <div>
                <p className="font-medium text-cocoa">Instagram</p>
                <p className="text-sm text-cocoa-light">@stitchandyarn.deepa — DMs open, follow for new drops!</p>
              </div>
            </a>

            <a
              href={`mailto:${siteSettings.email}`}
              className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-rose-line/20 shadow-soft hover:shadow-card transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={22} className="text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-cocoa">Email</p>
                <p className="text-sm text-cocoa-light">{siteSettings.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-rose-line/20 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-blush-light flex items-center justify-center shrink-0">
                <Clock size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-cocoa">Response Time</p>
                <p className="text-sm text-cocoa-light">Usually within 2–4 hours on WhatsApp, 24 hours on email</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 bg-surface rounded-2xl border border-rose-line/20 shadow-soft">
              <div className="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
                <MapPin size={22} className="text-sage" />
              </div>
              <div>
                <p className="font-medium text-cocoa">Based in India</p>
                <p className="text-sm text-cocoa-light">Shipping across all states via trusted courier partners</p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Contact form */}
        <FadeUp delay={0.2}>
          <form
            onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('contact-name') as HTMLInputElement).value;
              const msg = (form.elements.namedItem('contact-message') as HTMLTextAreaElement).value;
              const whatsappMsg = `Hi Deepa! I'm ${name}.\n\n${msg}`;
              window.open(`https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
            }}
            className="bg-surface rounded-2xl p-6 md:p-8 border border-rose-line/20 shadow-card space-y-4"
          >
            <h2 className="font-heading text-xl font-medium text-cocoa mb-2">Send a Message</h2>
            <p className="text-sm text-cocoa-light mb-4">
              Fill in the form and it'll open a WhatsApp chat with your message pre-filled.
            </p>

            <div>
              <label htmlFor="contact-name" className="label-caps text-cocoa-light block mb-1.5">Your Name</label>
              <input
                id="contact-name"
                type="text"
                required
                placeholder="Priya"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="label-caps text-cocoa-light block mb-1.5">Email (optional)</label>
              <input
                id="contact-email"
                type="email"
                placeholder="priya@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="label-caps text-cocoa-light block mb-1.5">Message</label>
              <textarea
                id="contact-message"
                required
                rows={5}
                placeholder="Hi Deepa, I wanted to ask about..."
                className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-cream text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm resize-none"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center">
              <MessageCircle size={18} /> Send via WhatsApp
            </button>
          </form>
        </FadeUp>
      </div>
    </main>
  );
}
