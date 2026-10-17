import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard, FadeUp, SectionHeading } from '@/components/UI';
import { products, categories } from '@/data';

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name';

export function ShopPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategorySlug = searchParams.get('category') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.is_active);

    // Category filter
    if (activeCategorySlug) {
      const cat = categories.find(c => c.slug === activeCategorySlug);
      if (cat) result = result.filter(p => p.category_id === cat.id);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Price
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [activeCategorySlug, searchQuery, sortBy, priceRange]);

  const setCategory = (slug: string) => {
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <FadeUp>
        <SectionHeading
          scriptAccent="shop"
          title={activeCategorySlug
            ? categories.find(c => c.slug === activeCategorySlug)?.name || 'Shop'
            : 'All Products'
          }
          subtitle="Each piece is handmade — so every one is a little unique"
        />
      </FadeUp>

      {/* Search bar */}
      <div className="max-w-lg mx-auto mb-8">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-light" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for sunflower bun stick, keychain..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-rose-line/30 bg-surface text-cocoa placeholder:text-cocoa-light/50 focus:border-primary focus:outline-none transition-colors"
            id="shop-search"
          />
        </div>
      </div>

      {/* Category chips + filter toggle */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setCategory('')}
            className={`badge text-sm py-1.5 px-4 cursor-pointer shrink-0 transition-all ${
              !activeCategorySlug
                ? 'bg-primary text-cream'
                : 'badge-blush hover:bg-blush'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`badge text-sm py-1.5 px-4 cursor-pointer shrink-0 transition-all ${
                activeCategorySlug === cat.slug
                  ? 'bg-primary text-cream'
                  : 'badge-blush hover:bg-blush'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-ghost p-2 rounded-full flex items-center gap-1.5 text-sm shrink-0"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Expanded filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-surface rounded-2xl p-6 border border-rose-line/20 flex flex-wrap gap-6 items-end">
              {/* Sort */}
              <div className="min-w-[160px]">
                <label className="label-caps text-cocoa-light block mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2.5 rounded-lg border border-rose-line/30 bg-cream text-cocoa focus:border-primary focus:outline-none text-sm"
                  id="shop-sort"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              {/* Price range */}
              <div className="min-w-[200px]">
                <label className="label-caps text-cocoa-light block mb-2">
                  Price: ₹{priceRange[0]} – ₹{priceRange[1]}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary"
                  id="shop-price-filter"
                />
              </div>

              {/* Reset */}
              <button
                onClick={() => { setSortBy('newest'); setPriceRange([0, 2000]); setSearchQuery(''); setCategory(''); }}
                className="btn btn-ghost text-sm"
              >
                <X size={14} /> Reset all
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-cocoa-light mb-6">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>

      {/* Product grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, i) => (
            <FadeUp key={product.id} delay={i * 0.05}>
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
      ) : (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🧶</p>
          <h3 className="font-heading text-xl font-medium text-cocoa mb-2">No products found</h3>
          <p className="text-cocoa-light text-sm">Try a different search or browse all categories</p>
          <button onClick={() => { setSearchQuery(''); setCategory(''); }} className="btn btn-secondary mt-4">
            View all products
          </button>
        </div>
      )}
    </main>
  );
}
