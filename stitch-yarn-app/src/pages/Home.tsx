import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Gift, Truck, Shield, Heart, Package } from 'lucide-react';
import { FadeUp, ProductCard, SectionHeading, StarRating } from '@/components/UI';
import { SectionDivider, HeartFlourish, BotanicalSprig, YarnSquiggle } from '@/components/Motifs';
import { products, categories, testimonials, siteSettings, formatPrice } from '@/data';

export function HomePage() {
  const navigate = useNavigate();
  const bestsellers = products.filter(p => p.is_active).slice(0, 4);

  return (
    <main>
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-cream min-h-[85vh] md:min-h-[90vh] flex items-center">
        {/* Decorative background elements */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blush/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

        {/* Animated thread SVG */}
        <svg
          className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
          viewBox="0 0 1000 600"
          aria-hidden="true"
        >
          <path
            d="M0,300 Q250,100 500,300 T1000,300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
          <path
            d="M0,350 Q250,150 500,350 T1000,350"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-rose-line"
          />
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center md:text-left">
            <FadeUp>
              <span className="label-caps text-primary tracking-[0.2em] block mb-3">
                Handmade with love
              </span>
            </FadeUp>

            <FadeUp delay={0.1}>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-cocoa leading-[1.1] mb-4">
                Every stitch{' '}
                <span className="font-script text-primary font-normal">
                  tells a story
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-cocoa-light text-lg md:text-xl max-w-lg mx-auto md:mx-0 mb-8 leading-relaxed">
                Crochet accessories, personalised keychains, and blooming flower pots — each piece crafted by hand, just for you.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Link to="/shop" className="btn btn-primary text-base px-8 py-3.5">
                  Shop the collection <ArrowRight size={18} />
                </Link>
                <Link to="/custom-order" className="btn btn-secondary text-base px-8 py-3.5">
                  <Sparkles size={18} /> Request a custom piece
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="mt-8 flex items-center gap-4 justify-center md:justify-start text-sm text-cocoa-light">
                <span className="flex items-center gap-1.5">
                  <Heart size={14} className="text-primary" /> 500+ happy customers
                </span>
                <span className="w-1 h-1 bg-rose-line rounded-full" />
                <span className="flex items-center gap-1.5">
                  <Package size={14} className="text-sage" /> Ships all-India
                </span>
              </div>
            </FadeUp>
          </div>

          {/* Hero image grid */}
          <FadeUp delay={0.2} className="relative">
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <motion.div
                className="rounded-2xl overflow-hidden shadow-card"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <img
                  src="/products/Handmade flower pot.jpeg"
                  alt="Handmade crochet flower pot with pink and lavender blooms"
                  className="w-full aspect-[3/4] object-cover"
                />
              </motion.div>
              <div className="space-y-3 md:space-y-4 pt-8">
                <motion.div
                  className="rounded-2xl overflow-hidden shadow-card"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src="/products/Handmade Embroidery hoop with a pink bow.jpeg"
                    alt="Personalised crochet initial keychain with bow"
                    className="w-full aspect-square object-cover"
                  />
                </motion.div>
                <motion.div
                  className="rounded-2xl overflow-hidden shadow-card"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <img
                    src="/products/Evil eye Hair tie.jpeg"
                    alt="Blue bloom crochet hair bun stick"
                    className="w-full aspect-[4/3] object-cover"
                  />
                </motion.div>
              </div>
            </div>
            {/* Decorative floating badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 bg-surface rounded-2xl shadow-card px-4 py-3 flex items-center gap-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-2xl">🧶</span>
              <div>
                <p className="text-xs font-semibold text-cocoa">Handcrafted</p>
                <p className="text-[0.65rem] text-cocoa-light">Made in India</p>
              </div>
            </motion.div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Category Tiles ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <FadeUp>
          <SectionHeading
            scriptAccent="explore"
            title="Shop by Category"
            subtitle="Find your favourite handmade piece"
          />
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {categories.map((cat, i) => (
            <FadeUp key={cat.id} delay={i * 0.1}>
              <Link
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
              >
                <div className="aspect-square">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-cocoa/70 via-cocoa/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-heading text-lg md:text-xl font-medium text-cream">
                    {cat.name}
                  </h3>
                  <p className="text-cream/70 text-xs mt-0.5 hidden md:block">
                    {cat.description.split('.')[0]}
                  </p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* ═══ Bestsellers ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <FadeUp>
          <SectionHeading
            scriptAccent="favourites"
            title="Bestsellers"
            subtitle="The pieces everyone loves — and you will too"
          />
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
          {bestsellers.map((product, i) => (
            <FadeUp key={product.id} delay={i * 0.1}>
              <ProductCard
                name={product.name}
                price={product.price}
                comparePrice={product.compare_price}
                image={product.images[0]?.url || ''}
                imageAlt={product.images[0]?.alt_text || product.name}
                badges={[
                  ...(product.compare_price ? ['Sale'] : []),
                  ...(product.is_made_to_order ? ['Made to order'] : []),
                  ...(product.stock_count === 0 && !product.is_made_to_order ? ['Sold out'] : []),
                ]}
                onClick={() => navigate(`/shop/${product.slug}`)}
              />
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.4}>
          <div className="text-center mt-10">
            <Link to="/shop" className="btn btn-secondary">
              View all products <ArrowRight size={16} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ═══ Made to Order Banner ═══ */}
      <section className="mx-4 sm:mx-6 lg:mx-auto max-w-5xl">
        <FadeUp>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-gold p-8 md:p-12 text-cream">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10 text-center md:text-left md:flex md:items-center md:justify-between gap-8">
              <div>
                <span className="font-script text-2xl block mb-1">personalise yours</span>
                <h2 className="font-heading text-3xl md:text-4xl font-semibold mb-2">
                  Made to Order
                </h2>
                <p className="text-cream/80 max-w-md">
                  Pick your colours, add your initial, choose your size — each piece is made just for you, from scratch. Handmade in 3–7 days.
                </p>
              </div>
              <Link
                to="/custom-order"
                className="btn bg-cream text-primary hover:bg-surface mt-6 md:mt-0 shrink-0 font-semibold"
              >
                <Sparkles size={18} /> Request a custom piece
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      <SectionDivider />

      {/* ═══ About Deepa Strip ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <FadeUp>
          <div className="md:flex items-center gap-12">
            <div className="md:w-1/3 mb-8 md:mb-0 flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-rose-line/30 p-1">
                  <img
                    src="/logo.jpeg"
                    alt="Deepa, the maker behind Stitch & Yarn"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-surface rounded-full shadow-card px-3 py-1.5"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-sm">✨</span>
                </motion.div>
              </div>
            </div>
            <div className="md:w-2/3 text-center md:text-left">
              <span className="font-script text-2xl text-primary block mb-1">meet the maker</span>
              <h2 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa mb-4">
                Hi, I'm Deepa
              </h2>
              <p className="text-cocoa-light leading-relaxed mb-4">
                What started as a quiet evening hobby — just me, my hook, and a ball of yarn — slowly became something I couldn't stop doing. Every piece I make carries a little bit of that feeling: calm, creative, and full of love.
              </p>
              <p className="text-cocoa-light leading-relaxed mb-6">
                Stitch & Yarn is my way of sharing that with you. Each flower, each letter, each tiny bead is placed with care. Because handmade things should feel like they were made by someone who truly loved making them.
              </p>
              <Link to="/about" className="btn btn-secondary">
                Read my story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="bg-surface py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeUp>
            <SectionHeading
              scriptAccent="love notes"
              title="What Our Customers Say"
            />
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {testimonials.map((t, i) => (
              <FadeUp key={t.id} delay={i * 0.1}>
                <div className="bg-cream rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow h-full flex flex-col">
                  <StarRating rating={t.rating} />
                  <p className="text-cocoa-light text-sm leading-relaxed mt-3 flex-1">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-rose-line/10">
                    <div className="w-9 h-9 rounded-full bg-blush flex items-center justify-center text-primary font-semibold text-sm">
                      {t.avatar_initial}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-cocoa">{t.name}</p>
                      <p className="text-xs text-cocoa-light">{t.location}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Trust Badges ═══ */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Heart size={28} />, title: 'Handmade', desc: 'Crafted with love, one stitch at a time' },
              { icon: <Gift size={28} />, title: 'Gift-Ready', desc: 'Beautiful packaging, ready to gift' },
              { icon: <Truck size={28} />, title: 'Ships All-India', desc: `Free above ${formatPrice(siteSettings.free_shipping_threshold)}` },
              { icon: <Shield size={28} />, title: 'Secure Payment', desc: 'UPI, cards & WhatsApp ordering' },
            ].map((badge, i) => (
              <FadeUp key={badge.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-blush-light flex items-center justify-center text-primary mb-3">
                    {badge.icon}
                  </div>
                  <h3 className="font-heading text-lg font-medium text-cocoa">{badge.title}</h3>
                  <p className="text-xs text-cocoa-light mt-1">{badge.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>
      </section>

      <SectionDivider />

      {/* ═══ Newsletter / WhatsApp Signup ═══ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <FadeUp>
          <span className="font-script text-2xl text-primary block mb-1">stay in the loop</span>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-cocoa mb-3">
            New drops, restocks & little surprises
          </h2>
          <p className="text-cocoa-light mb-8 max-w-md mx-auto">
            Be the first to know when new pieces drop. No spam — just pretty things in your inbox.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-full border border-rose-line/40 bg-surface text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none transition-colors"
            />
            <button type="submit" className="btn btn-primary whitespace-nowrap">
              Keep me posted <HeartFlourish className="text-blush" />
            </button>
          </form>
          <p className="text-xs text-cocoa-light/60 mt-3">
            Or join our WhatsApp broadcast for instant updates 💬
          </p>
        </FadeUp>
      </section>
    </main>
  );
}
