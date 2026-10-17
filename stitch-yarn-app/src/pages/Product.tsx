import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Truck, Clock, ChevronDown, ChevronLeft, ArrowRight, Minus, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProductBySlug, products, formatPrice, siteSettings, getCategoryById } from '@/data';
import { useCartStore } from '@/store';
import { FadeUp, ProductCard, LazyImage } from '@/components/UI';
import type { PersonalisationData } from '@/types';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');
  const addItem = useCartStore(s => s.addItem);
  const openCart = useCartStore(s => s.openCart);

  const [selectedImage, setSelectedImage] = useState(0);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const [personalisation, setPersonalisation] = useState<PersonalisationData>({});
  const [quantity, setQuantity] = useState(1);
  const [careOpen, setCareOpen] = useState(false);

  if (!product) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🧶</p>
        <h1 className="font-heading text-2xl font-semibold text-cocoa mb-2">Product not found</h1>
        <p className="text-cocoa-light mb-6">This piece might have been sold or doesn't exist.</p>
        <Link to="/shop" className="btn btn-primary">Browse the shop</Link>
      </main>
    );
  }

  const category = getCategoryById(product.category_id);
  const isPersonalisable = product.category_id === 'cat-2'; // Keychains
  const canAddToCart = product.stock_count > 0 || product.is_made_to_order;
  const relatedProducts = products
    .filter(p => p.category_id === product.category_id && p.id !== product.id && p.is_active)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!canAddToCart) return;

    // Validate variant selections
    for (const variant of product.variants) {
      if (!variantSelections[variant.name]) {
        toast.error(`Please select a ${variant.name.toLowerCase()}`);
        return;
      }
    }

    // Validate personalisation for keychains
    if (isPersonalisable && !personalisation.initial_letter) {
      toast.error('Please enter your initial letter');
      return;
    }

    addItem(product, quantity, variantSelections, personalisation);
    toast.success(`${product.name} added to your bag!`, { icon: '🧶' });
    openCart();
  };

  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <nav className="flex items-center gap-2 text-sm text-cocoa-light" aria-label="Breadcrumb">
          <Link to="/shop" className="hover:text-primary transition-colors flex items-center gap-1">
            <ChevronLeft size={14} /> Shop
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/shop?category=${category.slug}`} className="hover:text-primary transition-colors">
                {category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-cocoa truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <FadeUp>
            <div className="space-y-3">
              {/* Main image */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-card bg-cream-dark"
                key={selectedImage}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src={product.images[selectedImage]?.url || ''}
                  alt={product.images[selectedImage]?.alt_text || product.name}
                  aspectRatio="4/5"
                  className="rounded-2xl"
                />
              </motion.div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        i === selectedImage
                          ? 'border-primary shadow-glow'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </FadeUp>

          {/* Product Info */}
          <FadeUp delay={0.1}>
            <div className="space-y-6">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                {product.compare_price && <span className="badge badge-sage">Sale</span>}
                {product.is_made_to_order && <span className="badge badge-gold">Made to order</span>}
                {product.stock_count === 0 && !product.is_made_to_order && <span className="badge badge-blush">Sold out</span>}
              </div>

              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.compare_price && (
                  <>
                    <span className="text-lg text-cocoa-light line-through">
                      {formatPrice(product.compare_price)}
                    </span>
                    <span className="badge badge-sage">
                      {Math.round((1 - product.price / product.compare_price) * 100)}% off
                    </span>
                  </>
                )}
              </div>

              <p className="text-cocoa-light leading-relaxed">
                {product.description}
              </p>

              {/* Delivery info */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 text-cocoa-light">
                  <Clock size={16} className="text-primary shrink-0" />
                  <span>Handmade in {product.processing_days}–{product.processing_days + 2} days</span>
                </div>
                <div className="flex items-center gap-2 text-cocoa-light">
                  <Truck size={16} className="text-sage shrink-0" />
                  <span>Free shipping above {formatPrice(siteSettings.free_shipping_threshold)}</span>
                </div>
              </div>

              {/* Variants */}
              {product.variants.map(variant => (
                <div key={variant.id}>
                  <label className="label-caps text-cocoa-light block mb-2">
                    {variant.name}
                    {variantSelections[variant.name] && (
                      <span className="text-primary normal-case ml-2">— {variantSelections[variant.name]}</span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => (
                      <button
                        key={option}
                        onClick={() => setVariantSelections(prev => ({ ...prev, [variant.name]: option }))}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          variantSelections[variant.name] === option
                            ? 'bg-primary text-cream border-primary'
                            : 'bg-surface border-rose-line/30 text-cocoa hover:border-primary'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Personalisation fields */}
              {isPersonalisable && (
                <div className="bg-blush-light/30 rounded-2xl p-5 space-y-4 border border-rose-line/20">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-primary" />
                    <h3 className="font-heading text-lg font-medium text-cocoa">Personalise this piece</h3>
                  </div>

                  <div>
                    <label htmlFor="initial-letter" className="label-caps text-cocoa-light block mb-1.5">
                      Your Initial Letter *
                    </label>
                    <input
                      id="initial-letter"
                      type="text"
                      maxLength={1}
                      value={personalisation.initial_letter || ''}
                      onChange={e => setPersonalisation(prev => ({
                        ...prev,
                        initial_letter: e.target.value.toUpperCase()
                      }))}
                      placeholder="A"
                      className="w-20 px-4 py-3 text-center text-xl font-heading font-semibold rounded-xl border border-rose-line/40 bg-surface text-cocoa focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="custom-notes" className="label-caps text-cocoa-light block mb-1.5">
                      Special notes (optional)
                    </label>
                    <textarea
                      id="custom-notes"
                      value={personalisation.notes || ''}
                      onChange={e => setPersonalisation(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g., Can you make the bow a little bigger?"
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-rose-line/40 bg-surface text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none text-sm resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-surface rounded-full border border-rose-line/30 px-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-cream-dark rounded-full transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 hover:bg-cream-dark rounded-full transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={18} />
                  {canAddToCart
                    ? `Add to bag — ${formatPrice(product.price * quantity)}`
                    : 'Sold out'
                  }
                </button>
              </div>

              {/* Care instructions accordion */}
              <div className="border border-rose-line/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setCareOpen(!careOpen)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-dark/50 transition-colors"
                  aria-expanded={careOpen}
                >
                  <span className="font-medium text-cocoa text-sm">Care Instructions</span>
                  <motion.div animate={{ rotate: careOpen ? 180 : 0 }}>
                    <ChevronDown size={18} className="text-cocoa-light" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {careOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-4 pb-4 text-sm text-cocoa-light leading-relaxed">
                        {product.care_instructions}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 md:mt-24">
            <FadeUp>
              <h2 className="font-heading text-2xl font-semibold text-cocoa mb-6">
                You might also love
              </h2>
            </FadeUp>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <FadeUp key={p.id} delay={i * 0.1}>
                  <ProductCard
                    name={p.name}
                    price={p.price}
                    comparePrice={p.compare_price}
                    image={p.images[0]?.url || ''}
                    imageAlt={p.images[0]?.alt_text || p.name}
                    onClick={() => navigate(`/shop/${p.slug}`)}
                  />
                </FadeUp>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky add-to-cart bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-rose-line/20 p-4 z-30">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-cocoa truncate">{product.name}</p>
            <p className="text-lg font-semibold text-primary">{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart}
            className="btn btn-primary flex-1 ml-auto disabled:opacity-50"
          >
            <ShoppingBag size={18} />
            {canAddToCart ? 'Add to bag' : 'Sold out'}
          </button>
        </div>
      </div>
    </main>
  );
}
