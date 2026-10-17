import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store';
import { Link } from 'react-router-dom';
import { formatPrice, siteSettings } from '@/data';
import { EmptyState } from './UI';

export function CartDrawer() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    getItemCount, getSubtotal, getShipping, getTotal,
  } = useCartStore();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const total = getTotal();
  const itemCount = getItemCount();
  const freeShippingRemaining = siteSettings.free_shipping_threshold - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cocoa/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-surface z-50 shadow-elevated flex flex-col"
            role="dialog"
            aria-label="Shopping bag"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-rose-line/20">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-heading text-xl font-medium">
                  Your Bag
                  {itemCount > 0 && (
                    <span className="text-cocoa-light text-sm ml-2">({itemCount})</span>
                  )}
                </h2>
              </div>
              <button onClick={closeCart} className="btn-ghost p-2 rounded-full" aria-label="Close bag">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {itemCount > 0 && freeShippingRemaining > 0 && (
              <div className="px-4 py-3 bg-blush-light/50">
                <p className="text-xs text-cocoa-light text-center">
                  Add {formatPrice(freeShippingRemaining)} more for <strong>free shipping!</strong>
                </p>
                <div className="mt-1.5 h-1.5 bg-cream-dark rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (subtotal / siteSettings.free_shipping_threshold) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {itemCount > 0 && freeShippingRemaining <= 0 && (
              <div className="px-4 py-2 bg-sage/10 text-center">
                <p className="text-xs text-sage font-semibold">🎉 You've unlocked free shipping!</p>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <EmptyState
                  icon={<ShoppingBag size={48} />}
                  title="Your bag is empty"
                  message="Looks like you haven't found your favourite piece yet. Let's fix that!"
                  action={
                    <Link to="/shop" onClick={closeCart} className="btn btn-primary">
                      Browse the collection
                    </Link>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-3 bg-cream rounded-lg p-3"
                    >
                      <img
                        src={item.product.images[0]?.url || ''}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded-md shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-cocoa truncate">
                          {item.product.name}
                        </h4>

                        {/* Variant & personalisation info */}
                        {Object.entries(item.variant_selections).length > 0 && (
                          <p className="text-xs text-cocoa-light mt-0.5">
                            {Object.entries(item.variant_selections).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                          </p>
                        )}
                        {item.personalisation.initial_letter && (
                          <p className="text-xs text-primary mt-0.5">
                            Letter: {item.personalisation.initial_letter}
                          </p>
                        )}

                        <p className="text-sm font-semibold text-primary mt-1">
                          {formatPrice(item.unit_price)}
                        </p>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 bg-surface rounded-full border border-rose-line/30">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-cream-dark rounded-full transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-cream-dark rounded-full transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-cocoa-light hover:text-primary transition-colors"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with totals */}
            {items.length > 0 && (
              <div className="border-t border-rose-line/20 p-4 bg-surface space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-cocoa-light">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cocoa-light">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-sage">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-rose-line/10">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                <div className="grid grid-cols-1 gap-2 pt-2">
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn btn-primary justify-center gap-2"
                  >
                    Checkout <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => {
                      // Generate WhatsApp message
                      const lines = items.map(item => {
                        let line = `• ${item.product.name} × ${item.quantity} — ${formatPrice(item.unit_price * item.quantity)}`;
                        const variants = Object.entries(item.variant_selections);
                        if (variants.length) line += `\n  ${variants.map(([k, v]) => `${k}: ${v}`).join(', ')}`;
                        if (item.personalisation.initial_letter) line += `\n  Letter: ${item.personalisation.initial_letter}`;
                        if (item.personalisation.name_text) line += `\n  Name: ${item.personalisation.name_text}`;
                        return line;
                      });
                      const msg = `Hi Deepa! 💕\n\nI'd like to order:\n\n${lines.join('\n\n')}\n\nTotal: ${formatPrice(total)}\n\nPlease let me know the next steps!`;
                      window.open(`https://wa.me/${siteSettings.whatsapp_number}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="btn btn-secondary justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order via WhatsApp
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
