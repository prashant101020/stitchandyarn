import { Link } from 'react-router-dom';
import { Mail, MapPin, Heart } from 'lucide-react';
import { BotanicalSprig, HeartFlourish, InstagramIcon } from './Motifs';
import { siteSettings } from '@/data';

const footerLinks = [
  {
    title: 'Shop',
    links: [
      { to: '/shop?category=hair-accessories', label: 'Hair Accessories' },
      { to: '/shop?category=keychains', label: 'Keychains' },
      { to: '/shop?category=home-decor', label: 'Home Decor' },
      { to: '/shop?category=gifting', label: 'Gifting' },
    ],
  },
  {
    title: 'Help',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/shipping-returns', label: 'Shipping & Returns' },
      { to: '/custom-order', label: 'Custom Orders' },
      { to: '/contact', label: 'Contact Us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-cocoa text-cream mt-16">
      {/* Top decorative border */}
      <div className="flex justify-center pt-8 text-rose-line">
        <BotanicalSprig />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpeg" alt="" className="h-10 rounded-full" aria-hidden="true" />
              <div>
                <span className="font-script text-xl text-cream block leading-none">
                  Stitch & Yarn
                </span>
                <span className="text-rose-line text-[0.6rem] label-caps block mt-0.5">
                  by Deepa
                </span>
              </div>
            </div>
            <p className="text-cream/70 text-sm leading-relaxed mb-4">
              Every stitch tells a story. Handmade crochet pieces crafted with love in India.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={siteSettings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href={`mailto:${siteSettings.email}`}
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="label-caps text-rose-line mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream/60 hover:text-cream transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40 flex items-center gap-1">
            Made with <HeartFlourish className="text-primary" /> by Deepa
          </p>
          <p className="text-xs text-cream/40">
            © {new Date().getFullYear()} Stitch & Yarn. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-cream/40">
            <MapPin size={12} />
            Ships across India
          </div>
        </div>
      </div>
    </footer>
  );
}
