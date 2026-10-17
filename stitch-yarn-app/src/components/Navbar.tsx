import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/custom-order', label: 'Custom Order' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-rose-line/20">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn-ghost p-2 -ml-2"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="Stitch & Yarn Home">
            <img
              src="/logo.jpeg"
              alt="Stitch & Yarn by Deepa"
              className="h-10 md:h-14 w-auto rounded-full"
            />
            <div className="hidden sm:block">
              <span className="font-script text-xl text-cocoa leading-none">
                Stitch & Yarn
              </span>
              <span className="label-caps text-cocoa-light block text-[0.6rem] mt-0.5">
                Handmade with love
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-sm font-medium transition-colors py-1 ${
                  location.pathname === link.to
                    ? 'text-primary'
                    : 'text-cocoa-light hover:text-primary'
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Link
              to="/shop"
              className="btn-ghost p-2 rounded-full"
              aria-label="Search products"
            >
              <Search size={20} />
            </Link>
            <button
              onClick={openCart}
              className="btn-ghost p-2 rounded-full relative"
              aria-label={`Shopping bag, ${itemCount} items`}
            >
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cocoa/30 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-surface z-50 md:hidden shadow-elevated p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <img src="/logo.jpeg" alt="Stitch & Yarn" className="h-10 rounded-full" />
                  <span className="font-script text-xl text-cocoa">Stitch & Yarn</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="btn-ghost p-2" aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`py-3 px-4 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'bg-blush-light text-primary'
                        : 'text-cocoa-light hover:bg-cream-dark hover:text-cocoa'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-rose-line/20">
                <p className="label-caps text-cocoa-light mb-2">Follow us</p>
                <a
                  href="https://instagram.com/stitchandyarn.deepa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2"
                >
                  <Heart size={14} /> @stitchandyarn.deepa
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
